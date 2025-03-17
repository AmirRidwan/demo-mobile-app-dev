<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Seat;
use App\Models\Movie;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        // ✅ 1. Seed movies first
        $this->seedMovies();

        // ✅ 2. Seed seats after movies exist
        $this->seedSeats();
    }

    /**
     * Seed the movies table.
     */
    private function seedMovies()
    {
        $movies = [
            [
                'id' => 1, // ✅ Ensure a fixed ID for reference
                'title' => 'Spider-Man 4',
                'genre' => 'Action, Adventure',
                'description' => 'Peter Parker faces new challenges as he balances life as Spider-Man and himself.',
                'poster' => '/images/spiderman.jpg',
                'release_date' => '2025-07-15',
                'duration' => 130,
                'rating' => 'PG-13',
                'score' => 4.5
            ],
            [
                'id' => 2,
                'title' => 'Batman',
                'genre' => 'Action, Superhero',
                'description' => 'An anti-hero is brought together to take on covert missions for his city.',
                'poster' => '/images/batman.jpg',
                'release_date' => '2025-12-20',
                'duration' => 140,
                'rating' => 'PG-13',
                'score' => 4.2
            ],
            [
                'id' => 3,
                'title' => 'Kluang Man',
                'genre' => 'Animation, Superhero',
                'description' => 'A Malaysian superhero protects his city from crime while dealing with his own struggles.',
                'poster' => '/images/kluangman.jpg',
                'release_date' => '2024-09-10',
                'duration' => 100,
                'rating' => 'PG',
                'score' => 4.0
            ],
        ];

        Movie::insert($movies);
    }

    /**
     * Seed the seats table.
     */
    private function seedSeats()
    {
        $rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; // 8 Rows
        $seatsPerRow = 15; // 15 seats per row
        $seats = [];

        foreach ($rows as $row) {
            for ($i = 1; $i <= $seatsPerRow; $i++) {
                $seats[] = [
                    'seat_number' => $row . $i,
                    'movie_id' => 1, // ✅ Reference an existing movie_id
                    'price' => 15.00,
                    'status' => 'available',
                ];
            }
        }

        Seat::insert($seats);
    }
}
