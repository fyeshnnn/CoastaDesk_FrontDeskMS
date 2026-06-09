<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DiscountRequest;
use App\Models\Bill;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DiscountApprovalController extends Controller
{
    // Get all discount requests
    public function index(Request $request)
    {
        $query = DiscountRequest::with(['reservation.guest', 'approvedBy']);
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $requests = $query->orderBy('created_at', 'desc')->paginate(50);
        
        return response()->json($requests);
    }
    
    // Get single discount request
    public function show($id)
    {
        $request = DiscountRequest::with(['reservation.guest', 'approvedBy'])->findOrFail($id);
        return response()->json($request);
    }
    
    // Create discount request
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reservation_id' => 'required|exists:reservations,id',
            'guest_name' => 'required|string|max:255',
            'discount_type' => 'required|string|max:255',
            'requested_amount' => 'required|numeric|min:0',
            'reason' => 'required|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $discountRequest = DiscountRequest::create([
            'reservation_id' => $request->reservation_id,
            'guest_name' => $request->guest_name,
            'discount_type' => $request->discount_type,
            'requested_amount' => $request->requested_amount,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);
        
        $this->logActivity($request->user()->id, 'Created discount request', 'Discounts', "Guest: {$discountRequest->guest_name}");
        
        return response()->json(['message' => 'Discount request submitted successfully', 'request' => $discountRequest], 201);
    }
    
    // Approve discount request (Manager only)
    public function approve(Request $request, $id)
    {
        $this->authorize('manager');
        
        $discountRequest = DiscountRequest::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'remarks' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $discountRequest->update([
            'status' => 'approved',
            'remarks' => $request->remarks,
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);
        
        // Apply discount to the bill
        $bill = Bill::where('reservation_id', $discountRequest->reservation_id)->first();
        if ($bill) {
            $newTotal = $bill->total_amount - $discountRequest->requested_amount;
            $bill->update([
                'discount_amount' => $discountRequest->requested_amount,
                'discount_reason' => $discountRequest->discount_type,
                'total_amount' => $newTotal,
                'balance' => $newTotal - $bill->paid_amount,
            ]);
        }
        
        $this->logActivity($request->user()->id, 'Approved discount request', 'Discounts', "Guest: {$discountRequest->guest_name}");
        
        return response()->json(['message' => 'Discount request approved successfully', 'request' => $discountRequest]);
    }
    
    // Reject discount request (Manager only)
    public function reject(Request $request, $id)
    {
        $this->authorize('manager');
        
        $discountRequest = DiscountRequest::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'remarks' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $discountRequest->update([
            'status' => 'rejected',
            'remarks' => $request->remarks,
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);
        
        $this->logActivity($request->user()->id, 'Rejected discount request', 'Discounts', "Guest: {$discountRequest->guest_name}");
        
        return response()->json(['message' => 'Discount request rejected', 'request