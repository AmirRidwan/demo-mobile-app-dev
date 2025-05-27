<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Booking extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->getKey()) {
                $model->{$model->getKeyName()} = (string) Str::ulid();
            }
        });
    }

    protected $fillable = [
        'movie_id',
        'showtime',
        'seat_selection',
        'status',
        'total_amount',
    ];

    protected $casts = [
        'seat_selection' => 'array',
        'showtime' => 'datetime',
    ];

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }

    public function foodItems()
    {
        return $this->belongsToMany(FoodItem::class, 'booking_food')->withPivot('quantity');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}

