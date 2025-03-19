<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Movie>
 */
class MovieFactory extends Factory {
    public function definition() {
        return [
            'title' => $this->faker->sentence(3),
            'genre' => $this->faker->randomElement(['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror']),
            'description' => $this->faker->paragraph(),
            'poster' => 'https://via.placeholder.com/200x300', // Placeholder image
            'duration' => $this->faker->numberBetween(90, 180), // Movie length
            'rating' => $this->faker->randomElement(['PG', 'PG-13', 'R']),
            'score' => $this->faker->randomFloat(1, 1, 5), // Rating between 1 and 5
        ];
    }
}

