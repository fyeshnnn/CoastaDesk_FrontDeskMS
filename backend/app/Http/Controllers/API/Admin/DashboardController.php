<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Room;
use App\Models\Guest;
use App\Models\Addon;
use App\Models\Reservation;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $stats = [
            'staff' => [
                'total' => User::whereIn('role', ['staff', 'manager', 'admin'])->count(),
                'frontDesk' => User::where('role', 'staff')->count(),
                'manager' => User::where('role', 'manager')->count(),
                'admin' => User::where('role', 'admin')->count(),
            ],
            'rooms' => [
                'total' => Room::count(),
                'active' => Room::where('status', 'available')->count(),
                'inactive' => Room::where('status', 'inactive')->count(),
                'maintenance' => Room::where('status', 'maintenance')->count(),
            ],
            'guests' => [
                'total' => Guest::count(),
            ],
            'addOns' => [
                'total' => Addon::count(),
                'active' => Addon::where('status', 'active')->count(),
                'inactive' => Addon::where('status', 'inactive')->count(),
                'categories' => Addon::distinct('category')->count('category'),
            ],
            'todayCheckins' => Reservation::whereDate('check_in', today())->count(),
            'pendingCheckouts' => Reservation::whereDate('check_out', today())
                ->where('status', 'checked_in')->count(),
            'activeBookings' => Reservation::where('status', 'confirmed')
                ->where('check_in', '<=', today())
                ->where('check_out', '>=', today())->count(),
        ];

        return response()->json($stats);
    }

    public function revenue()
    {
        $currentMonth = now()->month;
        $lastMonth = now()->subMonth()->month;
        
        $revenue = [
            'currentMonth' => Reservation::whereMonth('created_at', $currentMonth)
                ->sum('total_amount'),
            'lastMonth' => Reservation::whereMonth('created_at', $lastMonth)
                ->sum('total_amount'),
        ];
        
        $revenue['percentageChange'] = $revenue['lastMonth'] > 0 
            ? round((($revenue['currentMonth'] - $revenue['lastMonth']) / $revenue['lastMonth']) * 100, 1)
            : 0;

        return response()->json($revenue);
    }

    public function activity()
    {
        $activities = ActivityLog::with('user')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'user' => $log->user->first_name . ' ' . $log->user->last_name,
                    'role' => $log->user->role,
                    'module' => $log->module,
                    'date' => $log->created_at->format('Y-m-d'),
                    'time' => $log->created_at->format('h:i A'),
                ];
            });

        return response()->json($activities);
    }
}