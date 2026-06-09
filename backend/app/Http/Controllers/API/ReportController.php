<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Guest;
use App\Models\Bill;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    // Guest Report
    public function guestReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $guests = Guest::whereBetween('created_at', [$request->from_date, $request->to_date])
            ->withCount('reservations')
            ->orderBy('created_at', 'desc')
            ->get();
        
        $totalGuests = $guests->count();
        $newGuestsThisPeriod = Guest::whereBetween('created_at', [$request->from_date, $request->to_date])->count();
        $returningGuests = $guests->filter(function($guest) {
            return $guest->reservations_count > 1;
        })->count();
        
        return response()->json([
            'period' => [
                'from' => $request->from_date,
                'to' => $request->to_date,
            ],
            'summary' => [
                'total_guests' => $totalGuests,
                'new_guests' => $newGuestsThisPeriod,
                'returning_guests' => $returningGuests,
            ],
            'guests' => $guests,
        ]);
    }
    
    // Revenue Report
    public function revenueReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $bills = Bill::whereBetween('paid_at', [$request->from_date, $request->to_date])
            ->where('status', 'paid')
            ->get();
        
        $totalRevenue = $bills->sum('total_amount');
        
        // Revenue by room type
        $revenueByRoom = Bill::selectRaw('rooms.type, SUM(bills.total_amount) as total')
            ->join('reservations', 'bills.reservation_id', '=', 'reservations.id')
            ->join('rooms', 'reservations.room_id', '=', 'rooms.id')
            ->whereBetween('bills.paid_at', [$request->from_date, $request->to_date])
            ->where('bills.status', 'paid')
            ->groupBy('rooms.type')
            ->get();
        
        // Daily breakdown
        $dailyRevenue = Bill::selectRaw('DATE(paid_at) as date, SUM(total_amount) as daily_total')
            ->whereBetween('paid_at', [$request->from_date, $request->to_date])
            ->where('status', 'paid')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        // Add-on revenue
        $addonRevenue = Bill::selectRaw('SUM(addons_charge) as total_addon_revenue')
            ->whereBetween('paid_at', [$request->from_date, $request->to_date])
            ->where('status', 'paid')
            ->first();
        
        return response()->json([
            'period' => [
                'from' => $request->from_date,
                'to' => $request->to_date,
            ],
            'summary' => [
                'total_revenue' => $totalRevenue,
                'room_revenue' => $totalRevenue - ($addonRevenue->total_addon_revenue ?? 0),
                'addon_revenue' => $addonRevenue->total_addon_revenue ?? 0,
            ],
            'revenue_by_room_type' => $revenueByRoom,
            'daily_breakdown' => $dailyRevenue,
        ]);
    }
    
    // Occupancy Report
    public function occupancyReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $totalRooms = Room::where('is_active', true)->count();
        
        $occupancyData = [];
        $currentDate = new \DateTime($request->from_date);
        $endDate = new \DateTime($request->to_date);
        
        while ($currentDate <= $endDate) {
            $dateStr = $currentDate->format('Y-m-d');
            
            $occupiedRooms = Reservation::where('status', 'checked_in')
                ->whereDate('check_in', '<=', $dateStr)
                ->whereDate('check_out', '>=', $dateStr)
                ->count();
            
            $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100) : 0;
            
            $occupancyData[] = [
                'date' => $dateStr,
                'occupied_rooms' => $occupiedRooms,
                'total_rooms' => $totalRooms,
                'occupancy_rate' => $occupancyRate,
            ];
            
            $currentDate->modify('+1 day');
        }
        
        $averageOccupancy = collect($occupancyData)->avg('occupancy_rate');
        
        // Occupancy by room type
        $occupancyByType = Room::select('type')
            ->withCount(['reservations as occupied_count' => function($query) use ($request) {
                $query->where('status', 'checked_in')
                    ->whereBetween('check_in', [$request->from_date, $request->to_date]);
            }])
            ->get();
        
        return response()->json([
            'period' => [
                'from' => $request->from_date,
                'to' => $request->to_date,
            ],
            'summary' => [
                'average_occupancy_rate' => round($averageOccupancy, 2),
                'total_rooms' => $totalRooms,
            ],
            'daily_occupancy' => $occupancyData,
            'occupancy_by_room_type' => $occupancyByType,
        ]);
    }
    
    // Export report as CSV
    public function exportCsv(Request $request)
    {
        $type = $request->query('type', 'guests');
        $fromDate = $request->query('from_date');
        $toDate = $request->query('to_date');
        
        switch ($type) {
            case 'guests':
                $data = Guest::whereBetween('created_at', [$fromDate, $toDate])->get();
                $headers = ['ID', 'Name', 'Email', 'Phone', 'Registered Date'];
                $rows = $data->map(fn($g) => [$g->id, $g->full_name, $g->email, $g->phone, $g->created_at]);
                break;
            case 'revenue':
                $data = Bill::whereBetween('paid_at', [$fromDate, $toDate])->where('status', 'paid')->get();
                $headers = ['Bill Number', 'Total Amount', 'Payment Method', 'Paid At'];
                $rows = $data->map(fn($b) => [$b->bill_number, $b->total_amount, $b->payment_method, $b->paid_at]);
                break;
            default:
                return response()->json(['error' => 'Invalid report type'], 400);
        }
        
        $csv = fopen('php://temp', 'r+');
        fputcsv($csv, $headers);
        foreach ($rows as $row) {
            fputcsv($csv, (array) $row);
        }
        rewind($csv);
        $csvContent = stream_get_contents($csv);
        fclose($csv);
        
        return response($csvContent, 200)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="report.csv"');
    }
}