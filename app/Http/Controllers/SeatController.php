<?php

namespace App\Http\Controllers;

use App\Events\SeatLocked;
use App\Models\Seat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SeatController extends Controller
{
    public function index()
    {
        return response()->json(Seat::all());
    }

    public function toggleSeat(Request $request)
{
    $request->validate([
        'seat_number' => 'required|string|exists:seats,seat_number',
        'status' => 'required|string|in:available,locked',
    ]);

    $seat = Seat::where('seat_number', $request->seat_number)->first();

    if (!$seat) {
        return response()->json(['error' => 'Seat not found'], 404);
    }

    $userId = auth()->id(); // Get current user ID

    if ($request->status === 'locked') {
        // Lock the seat and store user ID
        $seat->update([
            'status' => 'locked',
            'user_id' => $userId,
        ]);
    } else {
        // Unlock the seat and remove user ID
        $seat->update([
            'status' => 'available',
            'user_id' => null,
        ]);
    }

    // Broadcast updated seat data
    broadcast(new SeatLocked($seat))->toOthers();

    return response()->json(['success' => true, 'seat' => $seat]);
}


    public function lockSeat(Request $request)
    {
        $request->validate([
            'seat_number' => 'required|string|exists:seats,seat_number',
        ]);

        $seat = Seat::where('seat_number', $request->seat_number)->first();

        if (!$seat || $seat->status !== 'available') {
            return response()->json(['error' => 'Seat is not available'], 400);
        }

        // Lock the seat
        $seat->update(['status' => 'locked']);
        $userId = auth()->id(); // Use a random ID if not logged in
        dd($userId);

        // Broadcast event with both parameters
        broadcast(new SeatLocked($seat->id, $userId))->toOthers();
        // Broadcast event

        return response()->json(['success' => true, 'seat' => $seat]);
    }

    public function unlockSeat(Request $request)
    {
        $seat = Seat::where('seat_number', $request->seat_number)->first();
        if ($seat && $seat->status === 'locked') {
            $seat->update(['status' => 'available', 'user_id' => null]);
            Cache::forget("seat_lock_{$seat->id}");
        }
        return response()->json(['success' => true]);
    }
}

