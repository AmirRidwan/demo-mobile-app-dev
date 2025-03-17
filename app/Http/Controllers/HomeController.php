<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {

        $new_movies = Http::withHeaders([
            'Authorization' => 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNWFkM2EwMTIwYTAzYzRjZWQ3NzllZWY0M2I4Y2I2YSIsIm5iZiI6MTc0MTk2MDQwNC43NjQsInN1YiI6IjY3ZDQzNGQ0OTE0ZGU4ZDg5MTAyOTNlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6ZOdBTA-t0s0K9NWINQ7qBfd9Sj8CUi4pT0JhaQYF4g',
            'accept' => 'application/json',
        ])->get('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_release_type=2|3')->json()['results'];

        $recommended_movies = Http::withHeaders([
            'Authorization' => 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNWFkM2EwMTIwYTAzYzRjZWQ3NzllZWY0M2I4Y2I2YSIsIm5iZiI6MTc0MTk2MDQwNC43NjQsInN1YiI6IjY3ZDQzNGQ0OTE0ZGU4ZDg5MTAyOTNlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6ZOdBTA-t0s0K9NWINQ7qBfd9Sj8CUi4pT0JhaQYF4g',
            'accept' => 'application/json',
        ])->get('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200')->json()['results'];

        $popular_movies = Http::withHeaders([
            'Authorization' => 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNWFkM2EwMTIwYTAzYzRjZWQ3NzllZWY0M2I4Y2I2YSIsIm5iZiI6MTc0MTk2MDQwNC43NjQsInN1YiI6IjY3ZDQzNGQ0OTE0ZGU4ZDg5MTAyOTNlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6ZOdBTA-t0s0K9NWINQ7qBfd9Sj8CUi4pT0JhaQYF4g',
            'accept' => 'application/json',
        ])->get('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=2&sort_by=popularity.desc')->json()['results'];

        return Inertia::render('welcome', [
            'new_movies' => $new_movies,
            'recommended_movies' => $recommended_movies,
            'popular_movies' => $popular_movies
        ]);
    }
}
