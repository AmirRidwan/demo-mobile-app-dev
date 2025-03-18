<?php

use App\Http\Controllers\Api\SeatController;
use App\Http\Controllers\Api\BookingController;

Route::get('/seats', [SeatController::class, 'index']);
Route::post('/seats/{id}/lock', [SeatController::class, 'lock']);
Route::post('/bookings', [BookingController::class, 'store']);