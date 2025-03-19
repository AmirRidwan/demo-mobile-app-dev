<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Support\Arr;

class MovieController extends Controller
{
    public function show($id)
    {
        $details = Http::withHeaders([
            'Authorization' => 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNWFkM2EwMTIwYTAzYzRjZWQ3NzllZWY0M2I4Y2I2YSIsIm5iZiI6MTc0MTk2MDQwNC43NjQsInN1YiI6IjY3ZDQzNGQ0OTE0ZGU4ZDg5MTAyOTNlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6ZOdBTA-t0s0K9NWINQ7qBfd9Sj8CUi4pT0JhaQYF4g',
            'accept' => 'application/json',
        ])->get('https://api.themoviedb.org/3/movie/' . $id . '?language=en-US&append_to_response=credits')->json();

        $fetch_trailer = Http::withHeaders([
            'Authorization' => 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNWFkM2EwMTIwYTAzYzRjZWQ3NzllZWY0M2I4Y2I2YSIsIm5iZiI6MTc0MTk2MDQwNC43NjQsInN1YiI6IjY3ZDQzNGQ0OTE0ZGU4ZDg5MTAyOTNlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6ZOdBTA-t0s0K9NWINQ7qBfd9Sj8CUi4pT0JhaQYF4g',
            'accept' => 'application/json',
        ])->get('https://api.themoviedb.org/3/movie/' . $id . '/videos?language=en-US')->json()['results'];

        // dd($fetch_trailer);

        // default to rick roll if movie has no trailer
        $trailer = Arr::first($fetch_trailer, function ($video) {
            return $video['site'] === 'YouTube';
        }, ['key' => 'kLnI9z27LTk']);


        // dd($trailer);

        $reviews = Http::withHeaders([
            'Authorization' => 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNWFkM2EwMTIwYTAzYzRjZWQ3NzllZWY0M2I4Y2I2YSIsIm5iZiI6MTc0MTk2MDQwNC43NjQsInN1YiI6IjY3ZDQzNGQ0OTE0ZGU4ZDg5MTAyOTNlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6ZOdBTA-t0s0K9NWINQ7qBfd9Sj8CUi4pT0JhaQYF4g',
            'accept' => 'application/json',
        ])->get('https://api.themoviedb.org/3/movie/' . $id . '/reviews?language=en-US&page=1')->json()['results'];

        // dd($reviews);
        $release_date = date('d M Y', strtotime($details['release_date']));

        $director = collect($details['credits']['crew'])->where('known_for_department', 'Directing')->first();

        $writer = collect($details['credits']['crew'])->where('known_for_department', 'Writing')->first();
        // dd($writer);
        return Inertia::render('movie', [
            'details' => $details,
            'trailer' => $trailer,
            'release_date' => $release_date,
            'casts' => $details['credits']['cast'],
            'director' => $director,
            'writer' => $writer,
            'reviews' => $reviews
        ]);
    }
}
