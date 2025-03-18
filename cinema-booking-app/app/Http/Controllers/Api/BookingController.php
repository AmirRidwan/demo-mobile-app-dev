<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'seat_id' => 'required|exists:seats,id',
        ]);

        $booking = Booking::create($request->all());
        return response()->json($booking, 201);
    }
}
