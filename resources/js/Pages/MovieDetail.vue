<template>
    <div class="min-h-screen bg-gray-900 text-white">
        <!-- BACK BUTTON -->
        <header class="p-4 flex items-center gap-4">
            <button @click="$inertia.get('/')" class="text-white text-xl">←</button>
            <h1 class="text-2xl font-bold">{{ movie.title }}</h1>
        </header>

        <!-- MOVIE TRAILER (Embed YouTube for Movie ID 1) -->
        <div class="relative w-full h-60 bg-gray-800 flex items-center justify-center">
            <iframe 
                v-if="movie.id === 1"
                class="w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/JfVOs4VSpmA?si=YRdQmR_Q8ySn3I_1" 
                title="Movie Trailer"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>

            <!-- Placeholder Play Button for Other Movies -->
            <button v-else class="text-white text-3xl">▶️</button>
        </div>

        <div class="p-6">
            <!-- MOVIE POSTER & INFO -->
            <div class="flex flex-col md:flex-row gap-6">
                <img :src="movie.poster" class="w-40 h-60 object-cover rounded-lg" />

                <div class="flex-1">
                    <h2 class="text-2xl font-bold">{{ movie.title }}</h2>
                    <div class="flex gap-2 mt-2">
                        <span v-for="genre in movie.genre.split(',')" :key="genre"
                            class="bg-gray-700 px-2 py-1 text-xs rounded-lg">
                            {{ genre.trim() }}
                        </span>
                    </div>
                    <p class="text-gray-400 text-sm mt-2">
                        📅 {{ new Date(movie.release_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }} 
                        | 🎬 {{ movie.duration }} min | ⭐ {{ movie.score }}/5
                    </p>
                </div>
            </div>

            <!-- MOVIE DETAILS -->
            <div class="mt-6 border-t border-gray-700 pt-4">
                <h3 class="text-xl font-bold">Full Synopsis</h3>
                <p class="text-gray-400 text-sm mt-2">{{ movie.description }}</p>
            </div>

            <!-- BOOK TICKET BUTTON (Dynamic) -->
            <button 
                v-if="movie.id !== 2 && movie.id !== 3" 
                @click="$inertia.get(`/booking?movie_id=${movie.id}`)" 
                class="bg-red-500 text-white w-full py-3 rounded-lg mt-6"
            >
                Book Ticket
            </button>

            <button 
                v-else 
                disabled
                class="bg-gray-600 text-white w-full py-3 rounded-lg mt-6 cursor-not-allowed"
            >
                Coming Soon
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    movie: Object, // ✅ Get the movie details from route
});

// ✅ Store the movie details from Inertia.js
const movie = ref(props.movie);
</script>

<style>
/* Responsive Layout Fixes */
@media (max-width: 640px) {
    .movie-detail {
        flex-direction: column;
    }
}
</style>
