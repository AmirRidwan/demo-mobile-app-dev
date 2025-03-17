<script setup>
import { ref, onMounted } from "vue";
import { useForm, usePage, router } from "@inertiajs/vue3";

const movie = ref(null);
const form = useForm({
    location: "",
    cinema: "",
    date: "",
    time: "",
    seats: [],
});

// Fetch movie details from route parameters
const movieId = usePage().props.ziggy.query.movie_id;

onMounted(async () => {
    if (movieId) {
        try {
            const response = await fetch(`/api/movies/${movieId}`);
            movie.value = await response.json();
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    }
});

// Proceed Booking
const proceedBooking = () => {
    router.visit("/booking-seats", {
        method: "post",
        data: form,
    });
};
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-white p-6">
        <h1 class="text-2xl font-bold text-center mb-4">🎟 Ticket Booking</h1>

        <div class="text-center text-gray-300 mb-4" v-if="movie">
            Booking for <span class="font-bold text-white">{{ movie.title }}</span>
        </div>

        <div class="space-y-4">
            <!-- Select Location -->
            <div>
                <label class="block text-gray-400 mb-1">Location</label>
                <select v-model="form.location" class="w-full p-2 rounded bg-gray-800">
                    <option disabled value="">Select Location</option>
                    <option>GSC Mid Valley</option>
                    <option>TGV Sunway</option>
                    <option>MBO One Utama</option>
                </select>
            </div>

            <!-- Select Cinema -->
            <div>
                <label class="block text-gray-400 mb-1">Cinema Hall</label>
                <select v-model="form.cinema" class="w-full p-2 rounded bg-gray-800">
                    <option disabled value="">Select Cinema Hall</option>
                    <option>IMAX</option>
                    <option>4DX</option>
                    <option>Regular</option>
                </select>
            </div>

            <!-- Select Date -->
            <div>
                <label class="block text-gray-400 mb-1">Select a Date</label>
                <div class="flex gap-2 overflow-x-auto">
                    <button v-for="date in ['Nov 17', 'Nov 18', 'Nov 19']" :key="date"
                        @click="form.date = date"
                        :class="form.date === date ? 'bg-red-500' : 'bg-gray-700'"
                        class="px-4 py-2 rounded">
                        {{ date }}
                    </button>
                </div>
            </div>

            <!-- Select Time -->
            <div>
                <label class="block text-gray-400 mb-1">Available Time</label>
                <div class="grid grid-cols-3 gap-2">
                    <button v-for="time in ['9:20AM', '1:20PM', '3:30PM']" :key="time"
                        @click="form.time = time"
                        :class="form.time === time ? 'bg-red-500' : 'bg-gray-700'"
                        class="p-2 rounded">
                        {{ time }}
                    </button>
                </div>
            </div>

            <!-- Proceed Button -->
            <div class="flex justify-between mt-4">
                <button @click="$inertia.get(`/movie/${movieId}`)" class="bg-gray-600 px-4 py-2 rounded">Cancel</button>
                <button @click="proceedBooking" :disabled="!form.location || !form.cinema || !form.date || !form.time"
                    class="bg-red-500 px-4 py-2 rounded disabled:bg-gray-700">
                    Proceed
                </button>
            </div>
        </div>
    </div>
</template>
