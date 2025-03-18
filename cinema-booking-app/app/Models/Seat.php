<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    protected $fillable = ['seat_number', 'is_locked'];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
