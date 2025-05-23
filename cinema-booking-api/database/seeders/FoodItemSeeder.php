<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FoodItem;
use Illuminate\Support\Str;

class FoodItemSeeder extends Seeder
{
    public function run(): void
    {
        FoodItem::insert([
            [
                'id' => (string) Str::ulid(),
                'name' => 'Popcorn',
                'price' => 5.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::ulid(),
                'name' => 'Soda',
                'price' => 3.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::ulid(),
                'name' => 'Nugget',
                'price' => 6.50,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}

