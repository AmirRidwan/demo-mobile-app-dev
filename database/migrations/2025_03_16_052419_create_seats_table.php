<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('seats', function (Blueprint $table) {
            $table->id();
            $table->string('seat_number')->unique();
            $table->enum('status', ['available', 'locked', 'booked'])->default('available');
            $table->foreignId('movie_id')->constrained()->onDelete('cascade'); // ✅ Ensures movies exist
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->decimal('price', 8, 2)->default(10.00); // ✅ Set default price
            $table->timestamps();
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seats');
    }
};
