<?php

use App\Http\Controllers\MovieController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SeatController;
use App\Models\Movie;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application.
| These routes are loaded by the RouteServiceProvider within a group
| that contains the "web" middleware group.
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => !Auth::check(),  
        'canRegister' => !Auth::check(),
        'user' => Auth::user(),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Explicitly define Login & Register routes
Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Auth/Register'))->name('register');

Route::get('/user', function (Request $request) {
    return response()->json(Auth::user());
})->middleware('auth');

Route::get('/movie/{id}', function ($id) {
    $movie = Movie::findOrFail($id);
    return Inertia::render('MovieDetail', ['movie' => $movie]);
})->name('movie.detail');

Route::get('/movies', [MovieController::class, 'index']);

Route::middleware(['auth'])->group(function () {
    Route::get('/booking', [SeatController::class, 'index'])->name('booking');

    // ✅ FIXED: Correctly fetch movie & seat data
    Route::get('/booking-summary', function (Request $request) {
        // Get movie details from database
        $movie = Movie::findOrFail($request->query('movie_id'));

        // Decode the selected seats from query params
        $selectedSeats = json_decode($request->query('seats'), true) ?? [];

        return Inertia::render('BookingSummary', [
            'movie' => $movie,
            'seats' => $selectedSeats,
        ]);
    })->middleware('auth')->name('booking.summary');

    Route::post('/release-seats', function (Request $request) {
        $seatIds = $request->input('seats');
    
        if (empty($seatIds)) {
            return response()->json(['message' => 'No seats to release'], 400);
        }
    
        DB::table('seats')
            ->whereIn('id', $seatIds)
            ->update([
                'user_id' => null,
                'status' => 'available'
            ]);
    
        return response()->json(['message' => 'Seats released successfully']);
    });

    Route::post('/lock-seat', [SeatController::class, 'lockSeat']);
    Route::post('/unlock-seat', [SeatController::class, 'unlockSeat']);
    Route::post('/toggle-seat', [SeatController::class, 'toggleSeat']);
    Route::get('/seats', [SeatController::class, 'index'])->name('seats.index');
});

// Dashboard Route (Requires Authentication)
Route::get('/dashboard', fn() => Inertia::render('Dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/choose-detail', fn() => Inertia::render('ChooseDetail'))->name('choosedetail.create');

// Booking Page Route
Route::get('/booking', fn() => Inertia::render('Booking'))
    ->middleware(['auth', 'verified'])
    ->name('booking');

// Profile Routes (Requires Authentication)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Logout Route
Route::post('/logout', function () {
    Auth::logout();
    session()->invalidate();
    session()->regenerateToken();
    return redirect('/');
})->name('logout');

// Include Auth Routes
require __DIR__.'/auth.php';
