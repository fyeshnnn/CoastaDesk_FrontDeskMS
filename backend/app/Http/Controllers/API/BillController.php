<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Reservation;
use App\Models\AddOn;
use App\Models\ReservationAddOn;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BillController extends Controller
{
    // Get all bills
    public function index(Request $request)
    {
        $query = Bill::with(['guest', 'reservation']);
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }
        
        $bills = $query->orderBy('created_at', 'desc')->paginate(50);
        
        return response()->json($bills);
    }
    
    // Get single bill
    public function show($id)
    {
        $bill = Bill::with(['guest', 'reservation.room', 'reservation.addons'])->findOrFail($id);
        return response()->json($bill);
    }
    
    // Get bill by reservation
    public function getByReservation($reservationId)
    {
        $bill = Bill::where('reservation_id', $reservationId)->firstOrFail();
        return response()->json($bill);
    }
    
    // Create bill for reservation
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reservation_id' => 'required|exists:reservations,id',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $reservation = Reservation::find($request->reservation_id);
        
        // Check if bill already exists
        $existingBill = Bill::where('reservation_id', $request->reservation_id)->first();
        if ($existingBill) {
            return response()->json(['error' => 'Bill already exists for this reservation'], 422);
        }
        
        $bill = Bill::create([
            'bill_number' => 'INV-' . strtoupper(Str::random(10)),
            'reservation_id' => $reservation->id,
            'guest_id' => $reservation->guest_id,
            'room_charge' => $reservation->total_amount,
            'addons_charge' => 0,
            'discount_amount' => 0,
            'total_amount' => $reservation->total_amount,
            'paid_amount' => 0,
            'balance' => $reservation->total_amount,
            'status' => 'pending',
            'created_by' => $request->user()->id,
        ]);
        
        $this->logActivity($request->user()->id, 'Created bill', 'Billing', "Bill: {$bill->bill_number}");
        
        return response()->json(['message' => 'Bill created successfully', 'bill' => $bill], 201);
    }
    
    // Add add-on to bill
    public function addAddon(Request $request, $id)
    {
        $bill = Bill::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'addon_id' => 'required|exists:addons,id',
            'quantity' => 'required|integer|min:1',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $addon = AddOn::find($request->addon_id);
        $addonTotal = $addon->price * $request->quantity;
        
        // Add to reservation addons pivot
        ReservationAddOn::create([
            'reservation_id' => $bill->reservation_id,
            'addon_id' => $request->addon_id,
            'quantity' => $request->quantity,
            'price' => $addon->price,
        ]);
        
        // Update bill
        $newAddonsCharge = $bill->addons_charge + $addonTotal;
        $bill->update([
            'addons_charge' => $newAddonsCharge,
            'total_amount' => $bill->room_charge + $newAddonsCharge - $bill->discount_amount,
            'balance' => ($bill->room_charge + $newAddonsCharge - $bill->discount_amount) - $bill->paid_amount,
        ]);
        
        $this->logActivity($request->user()->id, 'Added add-on to bill', 'Billing', "Bill: {$bill->bill_number}, Add-on: {$addon->name}");
        
        return response()->json(['message' => 'Add-on added successfully', 'bill' => $bill]);
    }
    
    // Remove add-on from bill
    public function removeAddon(Request $request, $id, $addonId)
    {
        $bill = Bill::findOrFail($id);
        
        $reservationAddon = ReservationAddOn::where('reservation_id', $bill->reservation_id)
            ->where('addon_id', $addonId)
            ->first();
        
        if (!$reservationAddon) {
            return response()->json(['error' => 'Add-on not found'], 404);
        }
        
        $addonTotal = $reservationAddon->price * $reservationAddon->quantity;
        
        $reservationAddon->delete();
        
        // Update bill
        $newAddonsCharge = $bill->addons_charge - $addonTotal;
        $bill->update([
            'addons_charge' => $newAddonsCharge,
            'total_amount' => $bill->room_charge + $newAddonsCharge - $bill->discount_amount,
            'balance' => ($bill->room_charge + $newAddonsCharge - $bill->discount_amount) - $bill->paid_amount,
        ]);
        
        $this->logActivity($request->user()->id, 'Removed add-on from bill', 'Billing', "Bill: {$bill->bill_number}");
        
        return response()->json(['message' => 'Add-on removed successfully', 'bill' => $bill]);
    }
    
    // Process payment
    public function processPayment(Request $request, $id)
    {
        $bill = Bill::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,credit_card,mobile_payment,bank_transfer',
            'payment_reference' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $amount = $request->amount;
        $newPaidAmount = $bill->paid_amount + $amount;
        
        if ($newPaidAmount > $bill->total_amount) {
            return response()->json(['error' => 'Payment amount exceeds total bill'], 422);
        }
        
        $status = $newPaidAmount >= $bill->total_amount ? 'paid' : 'partial';
        
        $bill->update([
            'paid_amount' => $newPaidAmount,
            'balance' => $bill->total_amount - $newPaidAmount,
            'status' => $status,
            'payment_method' => $request->payment_method,
            'payment_reference' => $request->payment_reference,
            'paid_at' => $status === 'paid' ? now() : null,
        ]);
        
        // If fully paid, update reservation
        if ($status === 'paid') {
            $reservation = Reservation::find($bill->reservation_id);
            $reservation->update(['paid_amount' => $bill->total_amount]);
        }
        
        $this->logActivity($request->user()->id, 'Processed payment', 'Billing', "Bill: {$bill->bill_number}, Amount: ₱{$amount}");
        
        return response()->json(['message' => 'Payment processed successfully', 'bill' => $bill]);
    }
    
    // Apply discount
    public function applyDiscount(Request $request, $id)
    {
        $bill = Bill::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'discount_amount' => 'required|numeric|min:0',
            'discount_reason' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $newTotal = $bill->room_charge + $bill->addons_charge - $request->discount_amount;
        
        if ($newTotal < 0) {
            return response()->json(['error' => 'Discount amount exceeds total'], 422);
        }
        
        $bill->update([
            'discount_amount' => $request->discount_amount,
            'discount_reason' => $request->discount_reason,
            'total_amount' => $newTotal,
            'balance' => $newTotal - $bill->paid_amount,
        ]);
        
        $this->logActivity($request->user()->id, 'Applied discount', 'Billing', "Bill: {$bill->bill_number}, Discount: ₱{$request->discount_amount}");
        
        return response()->json(['message' => 'Discount applied successfully', 'bill' => $bill]);
    }
    
    private function logActivity($userId, $action, $module, $details)
    {
        ActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'module' => $module,
            'details' => $details,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}