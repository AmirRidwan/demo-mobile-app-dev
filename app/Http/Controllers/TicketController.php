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
        $seats = json_decode(file_get_contents(public_path('/json/seat-status.json')));

        // dd($seats);

        return Inertia::render('book-ticket', [
            'locations' => $locations,
            'seats' => $seats
        ]);

        // tdl: set seat status to lock when user proceed to next step.
        // then only set seat to booked after completing payment
    }
}
