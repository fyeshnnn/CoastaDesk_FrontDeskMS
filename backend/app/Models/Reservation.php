<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_reference', 'confirmation_code', 'guest_id', 'room_id',
        'check_in', 'check_out', 'number_of_rooms', 'number_of_adults', 'children_ages',
        'number_of_nights', 'total_amount', 'paid_amount', 'status', 'source',
        'special_requests', 'check_in_time', 'check_out_time',
        'checked_in_by', 'checked_out_by'
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'children_ages' => 'array',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function checkedInBy()
    {
        return $this->belongsTo(User::class, 'checked_in_by');
    }

    public function checkedOutBy()
    {
        return $this->belongsTo(User::class, 'checked_out_by');
    }

    public function addons()
    {
        return $this->belongsToMany(Addon::class, 'reservation_addons')
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }

    public function bill()
    {
        return $this->hasOne(Bill::class);
    }

    public function discountRequest()
    {
        return $this->hasOne(DiscountRequest::class);
    }

    public function getTotalGuestsAttribute()
    {
        return $this->number_of_adults + count($this->children_ages ?? []);
    }

    public static function generateBookingReference()
    {
        $prefix = 'BK';
        $date = now()->format('ymd');
        $lastReservation = self::whereDate('created_at', today())->latest()->first();
        $number = $lastReservation ? (intval(substr($lastReservation->booking_reference, -4)) + 1) : 1;
        return $prefix . $date . str_pad($number, 4, '0', STR_PAD_LEFT);
    }

    public static function generateConfirmationCode()
    {
        return 'CMB-' . now()->format('Y') . '-' . str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);
    }
}