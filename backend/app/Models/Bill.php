<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'bill_number', 'reservation_id', 'guest_id', 'room_charge', 'addons_charge',
        'discount_amount', 'discount_reason', 'total_amount', 'paid_amount', 'balance',
        'status', 'payment_method', 'payment_reference', 'paid_at', 'created_by'
    ];

    protected $casts = [
        'room_charge' => 'decimal:2',
        'addons_charge' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'balance' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public static function generateBillNumber()
    {
        $prefix = 'INV';
        $year = now()->format('Y');
        $lastBill = self::whereYear('created_at', now()->year)->latest()->first();
        $number = $lastBill ? (intval(substr($lastBill->bill_number, -5)) + 1) : 1;
        return $prefix . $year . str_pad($number, 5, '0', STR_PAD_LEFT);
    }
}