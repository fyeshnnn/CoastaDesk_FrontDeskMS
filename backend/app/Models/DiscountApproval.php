<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountApproval extends Model
{
    protected $fillable = [
        'reservation_id', 'requested_by', 'approved_by', 'discount_type',
        'discount_amount', 'reason', 'status', 'remarks', 'approved_at'
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function requestedBy()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}