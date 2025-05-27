<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\FoodController;
use App\Http\Controllers\Api\PaymentController;

Route::get('/test', function () {
    return response()->json(['status' => 'API is working']);
});

// 🎬 Movie Endpoints
Route::apiResource('movies', MovieController::class)->only(['index', 'show']);

// 🎟 Booking Endpoints
Route::apiResource('bookings', BookingController::class)->only(['index', 'store', 'show']);
Route::post('/bookings/{id}/food-beverage', [BookingController::class, 'addFood']);

// 🍿 Food Options
Route::get('/food-beverage-options', [FoodController::class, 'index']);

// 💳 Payment Endpoints
Route::post('/bookings/{id}/checkout', [PaymentController::class, 'checkout']);
Route::post('/bookings/{id}/confirm-payment', [PaymentController::class, 'confirm']);

