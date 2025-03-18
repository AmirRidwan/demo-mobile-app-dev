<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/movies/{id}', [MovieController::class, 'show'])->name('movie_details');
Route::get('/movies/{id}/book-ticket', [TicketController::class, 'bookTicket'])->name('book.ticket');
Route::get('/movies/{id}/booking-summary', [TicketController::class, 'bookingSummary'])->name('book.summary');
Route::get('/payment-success', [PaymentController::class, 'paymentSuccess'])->name('payment.success');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
