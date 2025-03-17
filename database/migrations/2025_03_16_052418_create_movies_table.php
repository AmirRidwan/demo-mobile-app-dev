<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up() {
        Schema::create('movies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('genre');
            $table->text('description');
            $table->string('poster')->nullable(); // URL for movie poster
            $table->integer('duration')->nullable(); // Duration in minutes
            $table->string('rating')->nullable(); // e.g., PG-13, R
            $table->decimal('score', 3, 1)->default(0.0); // Average score (out of 5)
            $table->date('release_date')->nullable(); // Release date of the movie
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movies');
    }
};
