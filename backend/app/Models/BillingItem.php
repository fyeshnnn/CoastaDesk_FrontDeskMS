<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillingItem extends Model
{
    protected $fillable = [
        'billing_id', 'add_on_id', 'item_name', 'quantity', 'unit_price', 'total_price'
    ];

    public function billing()
    {
        return $this->belongsTo(Billing::class);
    }

    public function addOn()
    {
        return $this->belongsTo(AddOn::class);
    }
}