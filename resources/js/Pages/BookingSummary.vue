<template>
    <div class="summary-container">
        <h2 class="title">Booking Summary</h2>

        <!-- Movie Details -->
        <div class="movie-details">
            <img v-if="movie.poster" :src="movie.poster" class="movie-poster" alt="Movie Poster" />
            <div class="movie-info">
                <h3>{{ movie.title || "Unknown Movie" }}</h3>
                <p>{{ movie.genre || "Unknown Genre" }}</p>
                <p>{{ movie.duration ? movie.duration + " min" : "Unknown Duration" }}</p>
                <p>{{ movie.rating || "No Rating" }}</p>
            </div>
        </div>

        <!-- Pricing Details -->
        <div class="summary-section">
            <h3>Tickets</h3>
            <p>{{ selectedSeats.length }} x RM{{ seatPrice }} = RM{{ totalPrice }}</p>
            <h3>Service Charge</h3>
            <p>RM 2.00</p>
            <h3><strong>Total Amount</strong></h3>
            <p><strong>RM {{ (totalPrice + 2).toFixed(2) }}</strong></p>
        </div>

        <!-- Centered Buttons -->
        <div class="action-buttons">
            <button class="cancel-button" @click="cancelBooking">Cancel</button>
            <button class="proceed-button" @click="proceedToPayment" :disabled="selectedSeats.length === 0">
                Proceed to Payment
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { usePage } from "@inertiajs/vue3";

export default {
    data() {
        const props = usePage().props;
        return {
            movie: props.movie || {}, 
            selectedSeats: Array.isArray(props.seats) ? props.seats : [],
            seatPrice: 15, // Default price
        };
    },
    computed: {
        totalPrice() {
            return this.selectedSeats.reduce((sum, seat) => sum + (parseFloat(seat.price) || this.seatPrice), 0);
        }
    },
    methods: {
        async cancelBooking() {
            console.log("Canceling booking & updating seats...");

            if (this.selectedSeats.length === 0) {
                return this.$inertia.get('/'); // Redirect to homepage if no seats are selected
            }

            try {
                await axios.post('/release-seats', {
                    seats: this.selectedSeats.map(seat => seat.id)
                });

                console.log("Seats released successfully!");
                this.$inertia.get('/'); // Redirect to homepage after releasing seats
            } catch (error) {
                console.error("Error releasing seats:", error);
            }
        },
        proceedToPayment() {
            console.log("Proceeding to payment with:", {
                movie: this.movie,
                seats: this.selectedSeats,
                totalAmount: this.totalPrice + 2,
            });
            // Payment Integration Logic Here
        }
    }
};
</script>

<style>
.summary-container {
    text-align: center;
    padding: 20px;
    background-color: #1a1a1a;
    color: white;
}

/* Movie Details */
.movie-details {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    justify-content: center;
}

.movie-poster {
    width: 100px;
    height: 150px;
    border-radius: 8px;
}

.movie-info {
    text-align: left;
}

/* Summary Sections */
.summary-section {
    background-color: #222;
    padding: 15px;
    border-radius: 8px;
    margin: 10px 0;
}

/* Centered Buttons */
.action-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

/* Cancel & Proceed Buttons */
.cancel-button {
    background-color: red;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
}

.proceed-button {
    background-color: green;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
}

.proceed-button:disabled {
    background-color: gray;
    cursor: not-allowed;
}
</style>
