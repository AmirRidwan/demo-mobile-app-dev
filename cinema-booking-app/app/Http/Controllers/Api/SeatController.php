<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SeatController extends Controller
{
    public function index()
    {
        return Seat::all();
    }

    public function lock($id)
    {
        $seat = Seat::findOrFail($id);
        $seat->is_locked = true;
        $seat->save();
        return response()->json($seat);
    }
}
