<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscountRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id', 'guest_name', 'discount_type', 'requested_amount',
        'reason', 'status', 'remarks', 'approved_by', 'approved_at'
    ];

    protected $casts = [
        'requested_amount' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}