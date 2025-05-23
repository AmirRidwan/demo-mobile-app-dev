<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Movie extends Model
{
    public $incrementing = false;
    protected $keyType = 'string'; // ULID

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
        'title',
        'description',
        'genre',
        'release_date',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}

