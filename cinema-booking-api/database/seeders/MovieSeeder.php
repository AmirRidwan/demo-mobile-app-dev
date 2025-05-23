<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Movie;
use Illuminate\Support\Str;

class MovieSeeder extends Seeder
{
    public function run(): void
    {
        Movie::insert([
            [
                'id' => (string) Str::ulid(),
                'title' => 'Avengers: Endgame',
                'description' => 'Final battle against Thanos.',
                'genre' => 'Action',
                'release_date' => '2019-04-26',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::ulid(),
                'title' => 'Interstellar',
                'description' => 'Journey through space and time.',
                'genre' => 'Sci-Fi',
                'release_date' => '2014-11-07',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}

