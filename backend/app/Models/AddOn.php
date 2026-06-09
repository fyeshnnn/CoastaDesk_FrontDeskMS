<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Addon extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'category', 'price', 'duration', 'max_guests', 'description', 'status'
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function reservations()
    {
        return $this->belongsToMany(Reservation::class, 'reservation_addons')
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }
}