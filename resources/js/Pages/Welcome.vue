<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { Link, useForm } from "@inertiajs/vue3"; // ✅ Import Inertia Link & useForm for logout

defineProps({
    canLogin: Boolean,
    canRegister: Boolean,
    user: Object, // ✅ Receive authenticated user data
});

const movies = ref([]);
const loading = ref(true);
const form = useForm({}); // ✅ Form for logout

// Fetch movies from API when component loads
const fetchMovies = async () => {
    try {
        const response = await axios.get("/api/movies");
        movies.value = response.data;
    } catch (error) {
        console.error("Error fetching movies:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchMovies);

// ✅ Logout function
const logout = () => {
    form.post(route("logout"));
};
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-white">
        <!-- Header Section -->
        <header class="p-6 flex justify-between items-center">
            <!-- ✅ Profile Section -->
            <div class="flex items-center gap-3">
                <!-- Profile Image (Placeholder) -->
                <div class="w-10 h-10 bg-gray-500 rounded-full"></div>

                <!-- ✅ Show Different Greeting for Guest & Logged-in User -->
                <div>
                    <h2 class="text-lg font-bold">
                        {{ user ? `Hello, ${user.name}` : "Hello, Guest" }}
                    </h2>
                    <p class="text-sm text-gray-400">
                        {{ user ? "Want to go see a movie? Get your ticket today" : "Please sign in to book your tickets." }}
                    </p>
                </div>
            </div>

            <!-- Show Login/Register if NOT logged in, otherwise show Logout -->
            <div v-if="!user">
                <Link v-if="canLogin" :href="route('login')" class="bg-red-500 px-4 py-2 rounded-lg mr-2">
                    Login
                </Link>
                <Link v-if="canRegister" :href="route('register')" class="bg-blue-500 px-4 py-2 rounded-lg">
                    Register
                </Link>
            </div>

            <!-- Logout Button -->
            <button v-if="user" @click="logout" class="bg-gray-700 px-4 py-2 rounded-lg">
                Logout
            </button>
        </header>

        <!-- Search Bar -->
        <div class="p-4">
            <input
                type="text"
                placeholder="Search movies..."
                class="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none"
            />
        </div>

        <!-- Movie Sections -->
        <div class="p-6">
            <h2 class="text-xl font-bold mb-4">New Releases</h2>

            <!-- Loading State -->
            <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div v-for="n in 5" :key="n" class="bg-gray-700 h-40 animate-pulse rounded-lg"></div>
            </div>

            <!-- Movie Grid -->
            <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div 
                    v-for="movie in movies" 
                    :key="movie.id" 
                    class="bg-gray-800 p-2 rounded-lg cursor-pointer"
                    @click="$inertia.get(`/movie/${movie.id}`)"
                >
                    <img :src="movie.poster" :alt="movie.title" class="rounded-lg w-full h-40 object-cover" />
                    <h3 class="mt-2 font-bold text-sm">{{ movie.title }}</h3>
                    <p class="text-gray-400 text-xs">{{ movie.genre }}</p>
                </div>
            </div>
        </div>

    </div>
</template>

<style>
/* Responsive Design Fixes */
@media (max-width: 640px) {
    .grid-cols-5 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
