<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ComplianceLog;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ComplianceController extends Controller
{
    // Get all compliance logs
    public function index(Request $request)
    {
        $query = ComplianceLog::with('user');
        
        // Filter by severity
        if ($request->has('severity')) {
            $query->where('severity', $request->severity);
        }
        
        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }
        
        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('guest_name', 'like', "%{$search}%")
                  ->orWhere('room', 'like', "%{$search}%")
                  ->orWhere('violation_type', 'like', "%{$search}%");
            });
        }
        
        $logs = $query->orderBy('created_at', 'desc')->paginate(50);
        
        return response()->json($logs);
    }
    
    // Get single compliance log
    public function show($id)
    {
        $log = ComplianceLog::with('user')->findOrFail($id);
        return response()->json($log);
    }
    
    // Create compliance log
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'guest_name' => 'required|string|max:255',
            'room' => 'required|string|max:255',
            'violation_type' => 'required|string|max:255',
            'description' => 'required|string',
            'action_taken' => 'nullable|string',
            'severity' => 'required|in:low,medium,high',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $log = ComplianceLog::create([
            'guest_name' => $request->guest_name,
            'room' => $request->room,
            'violation_type' => $request->violation_type,
            'description' => $request->description,
            'action_taken' => $request->action_taken,
            'severity' => $request->severity,
            'logged_by' => $request->user()->id,
        ]);
        
        $this->logActivity($request->user()->id, 'Logged compliance violation', 'Compliance', "Guest: {$log->guest_name}, Violation: {$log->violation_type}");
        
        return response()->json(['message' => 'Compliance log created successfully', 'log' => $log], 201);
    }
    
    // Update compliance log (Admin only)
    public function update(Request $request, $id)
    {
        $this->authorize('admin');
        
        $log = ComplianceLog::findOrFail($id);
        
        $log->update($request->only([
            'action_taken', 'severity'
        ]));
        
        $this->logActivity($request->user()->id, 'Updated compliance log', 'Compliance', "Log ID: {$id}");
        
        return response()->json(['message' => 'Compliance log updated successfully', 'log' => $log]);
    }
    
    // Get compliance report
    public function report(Request $request)
    {
        $query = ComplianceLog::query();
        
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }
        
        $bySeverity = $query->selectRaw('severity, count(*) as count')
            ->groupBy('severity')
            ->get();
        
        $byViolation = $query->selectRaw('violation_type, count(*) as count')
            ->groupBy('violation_type')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();
        
        $totalLogs = $query->count();
        
        return response()->json([
            'total_logs' => $totalLogs,
            'by_severity' => $bySeverity,
            'top_violations' => $byViolation,
        ]);
    }
    
    // Delete compliance log (Admin only)
    public function destroy(Request $request, $id)
    {
        $this->authorize('admin');
        
        $log = ComplianceLog::findOrFail($id);
        $log->delete();
        
        $this->logActivity($request->user()->id, 'Deleted compliance log', 'Compliance', "Log ID: {$id}");
        
        return response()->json(['message' => 'Compliance log deleted successfully']);
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