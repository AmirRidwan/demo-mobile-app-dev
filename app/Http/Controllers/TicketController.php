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

        $seats = Http::withHeaders([
            'X-Master-Key' => '$2a$10$LqyWb2CiHK5f/ca.WPQ5q.LmdrBLjOEADLJWK7prLG7xjqq7gZbWW',
            'X-Access-Key' => '$2a$10$q/w/8.aWvxBkgTgh7iB6.OKhUHJv7BPJsFYLwW3ClVLC6Qzm97AAC',
            'accept' => 'application/json',
        ])->get('https://api.jsonbin.io/v3/b/67d935528960c979a574098a')->json();

        // dd($seats);

        return Inertia::render('book-ticket', [
            'id' => $id,
            'locations' => $locations,
            'seats' => $seats['record']
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


        $selected_seats = $request->selectedSeatsId;

        // get json file
        $seats_res = Http::withHeaders([
            'X-Master-Key' => '$2a$10$LqyWb2CiHK5f/ca.WPQ5q.LmdrBLjOEADLJWK7prLG7xjqq7gZbWW',
            'X-Access-Key' => '$2a$10$q/w/8.aWvxBkgTgh7iB6.OKhUHJv7BPJsFYLwW3ClVLC6Qzm97AAC',
            'accept' => 'application/json',
        ])->get('https://api.jsonbin.io/v3/b/67d935528960c979a574098a')->json();


        // dd(json_encode($seats_res['record']));

        // update seats
        foreach ($seats_res['record'] as $key => $seat) {
            if (in_array($seat['id'], $selected_seats)) {
                $seats_res['record'][$key]['status'] = "locked";
            }
        }

        $new_seats = json_encode($seats_res['record']);


        // dd($new_seats);
        $post_seats = Http::withHeaders([
            'X-Master-Key' => '$2a$10$LqyWb2CiHK5f/ca.WPQ5q.LmdrBLjOEADLJWK7prLG7xjqq7gZbWW',
            'X-Access-Key' => '$2a$10$q/w/8.aWvxBkgTgh7iB6.OKhUHJv7BPJsFYLwW3ClVLC6Qzm97AAC',
            'Content-Type' => 'application/json',
        ])->put(
            'https://api.jsonbin.io/v3/b/67d935528960c979a574098a',
            json_decode($new_seats)
        );



        return Inertia::render('booking-summary', [
            'details' => $movie
        ]);
        // // return $request->all();
    }
}
