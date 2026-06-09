<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComplianceLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_name', 'room', 'violation_type', 'description', 'action_taken', 'severity', 'logged_by'
    ];

    public function logger()
    {
        return $this->belongsTo(User::class, 'logged_by');
    }
}