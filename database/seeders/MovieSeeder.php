<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Movie;

class MovieSeeder extends Seeder
{
    public function run()
    {
        Movie::insert([
            [
                'title' => 'Spider-Man 4',
                'genre' => 'Action, Adventure',
                'poster' => 'https://upload.wikimedia.org/wikipedia/en/6/60/Spider-Man_4_poster.png',
                'description' => 'Peter Parker faces new challenges as he balances life as Spider-Man and himself.',
                'release_date' => '2025-07-15'
            ],
            [
                'title' => 'Thunderbolts',
                'genre' => 'Action, Superhero',
                'poster' => 'https://upload.wikimedia.org/wikipedia/en/9/96/Thunderbolts_%28film%29_poster.jpg',
                'description' => 'A team of anti-heroes is brought together to take on covert missions for the government.',
                'release_date' => '2025-12-20'
            ],
            [
                'title' => 'Kluang Man',
                'genre' => 'Animation, Superhero',
                'poster' => 'https://upload.wikimedia.org/wikipedia/en/a/a3/Kluang_Man_poster.jpg',
                'description' => 'A Malaysian superhero protects his city from crime while dealing with his own struggles.',
                'release_date' => '2024-09-10'
            ],
        ]);
    }
}



