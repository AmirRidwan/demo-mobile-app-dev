<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
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

    public function bookingSummary($id, Request $request)
    {

        // fetch movie details
        $movie = Http::withHeaders([
            'Authorization' => 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNWFkM2EwMTIwYTAzYzRjZWQ3NzllZWY0M2I4Y2I2YSIsIm5iZiI6MTc0MTk2MDQwNC43NjQsInN1YiI6IjY3ZDQzNGQ0OTE0ZGU4ZDg5MTAyOTNlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6ZOdBTA-t0s0K9NWINQ7qBfd9Sj8CUi4pT0JhaQYF4g',
            'accept' => 'application/json',
        ])->get('https://api.themoviedb.org/3/movie/' . $id . '?language=en-US')->json();


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
        // somehow doing this will cause the page to refresh
        // so any operation must be placed before this line
        Storage::disk('public')->put('seat-status.json', $new_seats);


        return Inertia::render('booking-summary', [
            'details' => $movie
        ]);
        // return $request->all();
    }
}
