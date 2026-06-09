<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GuestController extends Controller
{
    // Get all guests
    public function index(Request $request)
    {
        $query = Guest::query();
        
        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }
        
        $guests = $query->orderBy('created_at', 'desc')->paginate(50);
        
        return response()->json($guests);
    }
    
    // Get single guest
    public function show($id)
    {
        $guest = Guest::with('reservations')->findOrFail($id);
        return response()->json($guest);
    }
    
    // Search guests
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:2',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $query = $request->query;
        
        $guests = Guest::where('first_name', 'like', "%{$query}%")
            ->orWhere('last_name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->orWhere('phone', 'like', "%{$query}%")
            ->limit(20)
            ->get();
        
        return response()->json($guests);
    }
    
    // Create new guest
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'province' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $guest = Guest::create($request->all());
        
        $this->logActivity($request->user()->id, 'Created new guest', 'Guests', "Guest: {$guest->full_name}");
        
        return response()->json(['message' => 'Guest created successfully', 'guest' => $guest], 201);
    }
    
    // Update guest
    public function update(Request $request, $id)
    {
        $guest = Guest::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'phone' => 'sometimes|string|max:20',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $guest->update($request->all());
        
        $this->logActivity($request->user()->id, 'Updated guest', 'Guests', "Guest: {$guest->full_name}");
        
        return response()->json(['message' => 'Guest updated successfully', 'guest' => $guest]);
    }
    
    // Delete guest (soft delete)
    public function destroy(Request $request, $id)
    {
        $guest = Guest::findOrFail($id);
        
        // Check if guest has reservations
        if ($guest->reservations()->exists()) {
            return response()->json(['error' => 'Cannot delete guest with existing reservations'], 422);
        }
        
        $guest->delete();
        
        $this->logActivity($request->user()->id, 'Deleted guest', 'Guests', "Guest: {$guest->full_name}");
        
        return response()->json(['message' => 'Guest deleted successfully']);
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