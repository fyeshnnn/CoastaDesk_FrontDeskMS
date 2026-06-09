<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name', 'last_name', 'middle_name', 'email', 'username',
        'password', 'role', 'phone', 'address', 'city', 'province',
        'zip_code', 'country', 'status', 'last_login', 'avatar'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'last_login' => 'datetime',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'checked_in_by');
    }

    public function complianceLogs()
    {
        return $this->hasMany(ComplianceLog::class, 'logged_by');
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function bills()
    {
        return $this->hasMany(Bill::class, 'created_by');
    }

    public function guest()
    {
        return $this->hasOne(Guest::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}