<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Billing extends Model
{
    protected $fillable = [
        'bill_number', 'reservation_id', 'room_charge', 'add_ons_total', 'discount',
        'tax', 'total_amount', 'status', 'payment_method', 'payment_reference',
        'paid_at', 'notes'
    ];

    protected $casts = [
        'paid_at' => 'datetime',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function items()
    {
        return $this->hasMany(BillingItem::class);
    }
}