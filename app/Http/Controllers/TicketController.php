<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function bookTicket($id)
    {


        $locations = json_decode(Storage::disk('public')->get('cinema-location.json'));
        // dd($locations);

        $seats = collect(json_decode(Storage::disk('public')->get('seat-status.json')));

        return Inertia::render('book-ticket', [
            'id' => $id,
            'locations' => $locations,
            'seats' => $seats
        ]);

        // tdl: set seat status to lock when user proceed to next step.
        // then only set seat to booked after completing payment
    }

    public function bookingSummary(Request $request)
    {

        $selected_seats = $request->all();

        // get json file
        $seats = collect(json_decode(Storage::disk('public')->get('seat-status.json')));

        // dd($seats);

        // update seats
        foreach ($selected_seats as $seatId) {
            $seats->where('id', $seatId)->first()->status = 'locked';
        };

        $new_seats = json_encode($seats);

        // save the new file
        Storage::disk('public')->put('seat-status.json', $new_seats);

        return Inertia::render('booking-summary');
        // return $request->all();
    }
}
