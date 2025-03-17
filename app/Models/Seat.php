<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    use HasFactory;

    protected $fillable = ['seat_number', 'status', 'user_id']; // Add 'status' here

    protected $casts = [
        'status' => 'string',
        'user_id'
    ];
}

