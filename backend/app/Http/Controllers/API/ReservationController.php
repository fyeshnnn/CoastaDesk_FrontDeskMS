<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Guest;
use App\Models\ActivityLog;
use App\Models\Bill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $query = Reservation::with(['guest', 'room']);
        
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('booking_reference', 'like', "%{$request->search}%")
                  ->orWhere('confirmation_code', 'like', "%{$request->search}%")
                  ->orWhereHas('guest', function($g) use ($request) {
                      $g->where('first_name', 'like', "%{$request->search}%")
                        ->orWhere('last_name', 'like', "%{$request->search}%");
                  });
            });
        }
        
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        if ($request->source && $request->source !== 'all') {
            $query->where('source', $request->source);
        }
        
        $perPage = $request->per_page ?? 10;
        $reservations = $query->latest()->paginate($perPage);
        
        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'guest_name' => 'required|string',
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date|after:today',
            'check_out' => 'required|date|after:check_in',
            'number_of_rooms' => 'required|integer|min:1',
            'number_of_adults' => 'required|integer|min:1',
            'children_ages' => 'nullable|array',
            'special_requests' => 'nullable|string',
        ]);

        DB::beginTransaction();
        
        try {
            // Create or find guest
            $guest = Guest::firstOrCreate(
                ['email' => $request->email],
                [
                    'first_name' => explode(' ', $request->guest_name)[0],
                    'last_name' => explode(' ', $request->guest_name)[1] ?? '',
                    'phone' => $request->phone ?? '',
                ]
            );
            
            $room = Room::findOrFail($request->room_id);
            
            // Check if room is available
            if (!$room->isAvailable($request->check_in, $request->check_out)) {
                return response()->json(['message' => 'Room is not available for selected dates'], 422);
            }
            
            $nights = (strtotime($request->check_out) - strtotime($request->check_in)) / (60 * 60 * 24);
            $totalAmount = $room->price * $nights;
            
            $reservation = Reservation::create([
                'booking_reference' => Reservation::generateBookingReference(),
                'confirmation_code' => Reservation::generateConfirmationCode(),
                'guest_id' => $guest->id,
                'room_id' => $request->room_id,
                'check_in' => $request->check_in,
                'check_out' => $request->check_out,
                'number_of_rooms' => $request->number_of_rooms,
                'number_of_adults' => $request->number_of_adults,
                'children_ages' => $request->children_ages,
                'number_of_nights' => $nights,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'source' => $request->source ?? 'online',
                'special_requests' => $request->special_requests,
            ]);
            
            ActivityLog::log(auth()->id(), 'Created reservation', 'Reservations', "Created reservation: {$reservation->booking_reference}");
            
            DB::commit();
            
            return response()->json($reservation, 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Failed to create reservation', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $reservation = Reservation::with(['guest', 'room', 'addons'])->findOrFail($id);
        return response()->json($reservation);
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        
        $request->validate([
            'check_in' => 'sometimes|date|after:today',
            'check_out' => 'sometimes|date|after:check_in',
            'status' => 'sometimes|in:pending,confirmed,checked_in,checked_out,cancelled',
        ]);
        
        $reservation->update($request->all());
        
        ActivityLog::log(auth()->id(), 'Updated reservation', 'Reservations', "Updated reservation: {$reservation->booking_reference}");
        
        return response()->json($reservation);
    }

    public function checkIn($id, Request $request)
    {
        $reservation = Reservation::findOrFail($id);
        
        if ($reservation->status !== 'confirmed') {
            return response()->json(['message' => 'Reservation must be confirmed before check-in'], 422);
        }
        
        $reservation->update([
            'status' => 'checked_in',
            'check_in_time' => now(),
            'checked_in_by' => auth()->id(),
        ]);
        
        // Update room status
        $reservation->room->update(['status' => 'occupied']);
        
        ActivityLog::log(auth()->id(), 'Checked in guest', 'Reservations', "Checked in: {$reservation->booking_reference}");
        
        return response()->json(['message' => 'Checked in successfully', 'reservation' => $reservation]);
    }

    public function checkOut($id, Request $request)
    {
        $reservation = Reservation::findOrFail($id);
        
        if ($reservation->status !== 'checked_in') {
            return response()->json(['message' => 'Reservation must be checked in before check-out'], 422);
        }
        
        $reservation->update([
            'status' => 'checked_out',
            'check_out_time' => now(),
            'checked_out_by' => auth()->id(),
        ]);
        
        // Update room status back to available
        $reservation->room->update(['status' => 'available']);
        
        ActivityLog::log(auth()->id(), 'Checked out guest', 'Reservations', "Checked out: {$reservation->booking_reference}");
        
        return response()->json(['message' => 'Checked out successfully', 'reservation' => $reservation]);
    }

    public function cancel($id)
    {
        $reservation = Reservation::findOrFail($id);
        
        if (in_array($reservation->status, ['checked_in', 'checked_out'])) {
            return response()->json(['message' => 'Cannot cancel checked-in or checked-out reservations'], 422);
        }
        
        $reservation->update(['status' => 'cancelled']);
        
        ActivityLog::log(auth()->id(), 'Cancelled reservation', 'Reservations', "Cancelled: {$reservation->booking_reference}");
        
        return response()->json(['message' => 'Reservation cancelled successfully']);
    }

    public function myBookings(Request $request)
    {
        $user = $request->user();
        $guest = Guest::where('user_id', $user->id)->first();
        
        if (!$guest) {
            return response()->json(['data' => []]);
        }
        
        $reservations = Reservation::with(['room'])
            ->where('guest_id', $guest->id)
            ->latest()
            ->get();
        
        return response()->json($reservations);
    }
}