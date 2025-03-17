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
        $locations = json_decode(file_get_contents(public_path('/json/cinema-location.json')));
        $seats = collect(json_decode(file_get_contents(public_path('/json/seat-status.json'))));
        // collect($seats)->where('id', 'A1')->first()->status = 'booked';
        // dd($seats->where('id', 'A1'));

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
        $seats = collect(json_decode(file_get_contents(public_path('/json/seat-status.json'))));

        // update seats
        foreach ($selected_seats as $seatId) {
            $seats->where('id', $seatId)->first()->status = 'booked';
        };

        $new_seats = json_encode($seats);

        // save the new file
        file_put_contents(public_path('/json/seat-status.json'), $new_seats);

        // dd(json_decode(file_get_contents(public_path('/json/seat-status.json'))));

        return Inertia::render('booking-summary');
        // return $request->all();
    }
}
