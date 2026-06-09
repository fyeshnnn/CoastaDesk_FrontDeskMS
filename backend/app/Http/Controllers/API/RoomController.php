<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomCategory;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::with('category')->where('is_active', true);
        
        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        $rooms = $query->get();
        
        return response()->json([
            'data' => $rooms,
            'types' => RoomCategory::all(),
        ]);
    }

    public function checkAvailability(Request $request)
    {
        $request->validate([
            'check_in' => 'required|date|after:today',
            'check_out' => 'required|date|after:check_in',
            'number_of_rooms' => 'required|integer|min:1',
            'adults' => 'required|integer|min:1',
            'children' => 'nullable|array',
        ]);

        $checkIn = $request->check_in;
        $checkOut = $request->check_out;
        $numberOfRooms = $request->number_of_rooms;
        $adults = $request->adults;
        $children = $request->children ?? [];

        $availableRooms = Room::with('category')
            ->where('status', 'available')
            ->where('is_active', true)
            ->get()
            ->filter(function($room) use ($checkIn, $checkOut) {
                return $room->isAvailable($checkIn, $checkOut);
            });

        $totalGuests = $adults + count($children);
        
        // Filter rooms by capacity
        $availableRooms = $availableRooms->filter(function($room) use ($totalGuests) {
            return $room->capacity >= $totalGuests;
        });

        return response()->json([
            'available_rooms' => $availableRooms->values(),
            'search_params' => [
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'number_of_rooms' => $numberOfRooms,
                'adults' => $adults,
                'children' => $children,
                'total_guests' => $totalGuests,
                'nights' => (strtotime($checkOut) - strtotime($checkIn)) / (60 * 60 * 24),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:rooms',
            'room_category_id' => 'required|exists:room_categories,id',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
        ]);

        $room = Room::create($request->all());
        
        ActivityLog::log(Auth::id(), 'Created room', 'Rooms', "Created room: {$room->name}");


        return response()->json($room, 201);
    }

    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|string|max:255|unique:rooms,name,' . $id,
            'price' => 'sometimes|numeric|min:0',
            'capacity' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:available,occupied,maintenance,inactive',
        ]);

        $room->update($request->all());
        
        ActivityLog::log(Auth::id(), 'Created room', 'Rooms', "Created room: {$room->name}");

        return response()->json($room);
    }

    public function getAvailabilityCalendar(Request $request)
    {
        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2024|max:2030',
        ]);

        $rooms = Room::where('is_active', true)->get();
        $startDate = date("{$request->year}-{$request->month}-01");
        $endDate = date("Y-m-t", strtotime($startDate));

        $calendar = [];
        $currentDate = $startDate;

        while ($currentDate <= $endDate) {
            $availableRooms = 0;
            $partiallyBooked = 0;
            $fullyBooked = 0;

            foreach ($rooms as $room) {
                if ($room->isAvailable($currentDate, date('Y-m-d', strtotime($currentDate . ' +1 day')))) {
                    $availableRooms++;
                } else {
                    $fullyBooked++;
                }
            }

            $totalRooms = count($rooms);
            $status = 'available';
            if ($fullyBooked === $totalRooms) {
                $status = 'booked';
            } elseif ($fullyBooked > $totalRooms / 2) {
                $status = 'partial';
            }

            $calendar[$currentDate] = [
                'date' => $currentDate,
                'status' => $status,
                'available_rooms' => $availableRooms,
                'booked_rooms' => $fullyBooked,
            ];

            $currentDate = date('Y-m-d', strtotime($currentDate . ' +1 day'));
        }

        return response()->json($calendar);
    }
}