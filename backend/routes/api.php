<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\AddonController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\GuestController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ComplianceController;
use App\Http\Controllers\Api\DiscountApprovalController;
use App\Http\Controllers\Api\BillController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);
    
    // Admin only routes
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('/dashboard/revenue', [DashboardController::class, 'revenue']);
        Route::get('/dashboard/activity', [DashboardController::class, 'activity']);
        
        // User Management
        Route::apiResource('users', UserController::class);
        Route::patch('/users/{id}/deactivate', [UserController::class, 'deactivate']);
        Route::patch('/users/{id}/activate', [UserController::class, 'activate']);
        
        // Room Management
        Route::apiResource('rooms', RoomController::class);
        Route::get('/rooms/types', [RoomController::class, 'getTypes']);
        Route::patch('/rooms/{id}/archive', [RoomController::class, 'archive']);
        Route::patch('/rooms/{id}/restore', [RoomController::class, 'restore']);
        
        // Add-ons Management
        Route::apiResource('addons', AddonController::class);
        Route::get('/addons/categories', [AddonController::class, 'getCategories']);
        Route::patch('/addons/{id}/toggle', [AddonController::class, 'toggleStatus']);
        Route::patch('/addons/{id}/archive', [AddonController::class, 'archive']);
        Route::patch('/addons/{id}/restore', [AddonController::class, 'restore']);
        
        // Activity Logs
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
        
        // Reports
        Route::post('/reports/{type}', [ReportController::class, 'generate']);
        Route::get('/reports/available', [ReportController::class, 'available']);
    });
    
    // Manager and Admin routes
    Route::middleware(['role:manager,admin'])->prefix('management')->group(function () {
        Route::apiResource('reservations', ReservationController::class);
        Route::apiResource('guests', GuestController::class);
        Route::apiResource('bills', BillController::class);
        Route::apiResource('compliance', ComplianceController::class);
        Route::apiResource('discount-approvals', DiscountApprovalController::class);
    });
});