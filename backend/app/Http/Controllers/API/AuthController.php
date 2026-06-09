<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Guest;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email_or_username' => 'required|string',
            'password' => 'required|string',
        ]);

        $field = filter_var($request->email_or_username, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        
        $user = User::where($field, $request->email_or_username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email_or_username' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email_or_username' => ['Your account is inactive. Please contact administrator.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;
        
        $user->update(['last_login' => now()]);

        ActivityLog::log($user->id, 'Logged in', 'Auth', 'User logged in successfully');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'username' => $user->username,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'phone' => $user->phone,
            ],
            'token' => $token,
            'role' => $user->role,
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        ActivityLog::log($user->id, 'Logged out', 'Auth', 'User logged out');
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'middle_name' => $request->middle_name,
            'email' => $request->email,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'role' => 'customer',
            'status' => 'active',
        ]);

        // Also create a guest record for the customer
        Guest::create([
            'user_id' => $user->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        ActivityLog::log($user->id, 'Registered', 'Auth', 'New user registered');

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        $guest = Guest::where('user_id', $user->id)->first();
        return response()->json([
            'user' => $user,
            'guest' => $guest,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string|max:100',
            'avatar' => 'sometimes|string',
        ]);

        $user->update($request->only(['first_name', 'last_name', 'phone', 'address', 'city', 'avatar']));
        
        // Update guest record as well
        if ($guest = Guest::where('user_id', $user->id)->first()) {
            $guest->update($request->only(['first_name', 'last_name', 'phone', 'address', 'city']));
        }

        ActivityLog::log($user->id, 'Updated profile', 'Auth', 'User updated their profile');

        return response()->json($user);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        ActivityLog::log($user->id, 'Changed password', 'Auth', 'User changed their password');

        return response()->json(['message' => 'Password changed successfully']);
    }
}