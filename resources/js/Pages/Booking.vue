<template>
    <div class="cinema-container">
        <h2 class="title">Cinema Booking</h2>

        <!-- Screen Section -->
        <div class="screen">SCREEN</div>

        <!-- Seats Layout -->
        <div class="seating">
            <div v-for="(row, rowIndex) in seatRows" :key="rowIndex" class="row">
                <button 
    v-for="seat in row" 
    :key="seat.id"
    :class="{
        'locked-by-me': seat.status === 'locked' && seat.lockedBy === currentUserId,  // ✅ CHECK if current user locked it
        'locked-by-others': seat.status === 'locked' && seat.lockedBy !== currentUserId && seat.lockedBy !== null,
        'booked': seat.status === 'booked',
        'available': seat.status === 'available'
    }"
    @click="toggleSeat(seat)"
    :disabled="seat.status === 'booked' || (seat.status === 'locked' && seat.lockedBy !== currentUserId)">
    <span v-if="seat.status === 'locked' && seat.lockedBy !== currentUserId">🔒</span>
    <span v-else>{{ seat.seat_number }}</span>
</button>
            </div>
        </div>

        <!-- Selected Seats & Total Price -->
        <div class="selected-seats">
            <h3>Selected Seats:</h3>
            <p v-if="selectedSeats.length === 0">No seats selected</p>
            <p v-else>{{ selectedSeats.map(seat => seat.seat_number).join(", ") }}</p>
            <h3>Total Price: RM {{ totalPrice }}</h3>
        </div>

        <!-- Centered Action Buttons -->
        <div class="action-buttons">
            <button class="cancel-button" @click="cancelBooking">Cancel</button>
            <button class="proceed-button" @click="proceedBooking" :disabled="selectedSeats.length === 0">Proceed</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            seats: [],
            seatRows: [],
            selectedSeats: [],
            currentUserId: null,
        };
    },
    async mounted() {
        console.log("Booking page loaded!");
        await this.getCurrentUser();
        this.fetchSeats();

        setInterval(() => {
        console.log("Refreshing seat data..."); // ✅ Check if this appears in console
        this.fetchSeats();
    }, 5000);
        // WebSocket real-time updates
        if (window.Echo) {
            console.log("Listening to WebSockets...");

            window.Echo.channel('seats')
                .listen('.seat.locked', (data) => {
                    console.log("Received WebSocket Event:", data);

                    const seat = this.seats.find(s => s.id === data.seatId);
                    if (seat) {
                        seat.status = data.status;
                        seat.lockedBy = data.lockedBy;
                    }
                });
        } else {
            console.error("Echo is not initialized.");
        }
    },
    computed: {
        totalPrice() {
            if (!Array.isArray(this.selectedSeats) || this.selectedSeats.length === 0) {
                return "0.00"; // Default if no seats are selected
            }
            return this.selectedSeats
                .filter(seat => seat.price) 
                .reduce((sum, seat) => sum + parseFloat(seat.price || 0), 0)
                .toFixed(2);
        }
    },
    methods: {
        async getCurrentUser() {
    try {
        const response = await axios.get('/user');
        this.currentUserId = response.data.id;
        console.log("Current User ID:", this.currentUserId); // ✅ Log it here
    } catch (error) {
        console.error("Error fetching user:", error);
    }
},
async fetchSeats() {
    try {
        const response = await axios.get('/seats');
        this.seats = response.data.map(seat => ({
            ...seat,
            lockedBy: seat.user_id // Ensure frontend recognizes the locking user
        }));
        this.organizeSeats();
    } catch (error) {
        console.error("Error loading seats:", error);
    }
},
        async toggleSeat(seat) {
            if (seat.status === 'locked' && seat.lockedBy !== this.currentUserId) {
                return;
            }

            try {
                const newStatus = seat.status === 'locked' ? 'available' : 'locked';

                const response = await axios.post('/toggle-seat', { 
                    seat_number: seat.seat_number,
                    status: newStatus
                });

                seat.status = newStatus;
                seat.lockedBy = newStatus === 'locked' ? this.currentUserId : null;

                if (newStatus === 'locked') {
                    this.selectedSeats.push(seat);
                } else {
                    this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
                }
            } catch (error) {
                console.error("Error toggling seat:", error);
            }
        },
        organizeSeats() {
            let rows = {};
            this.seats.forEach(seat => {
                const rowLetter = seat.seat_number.charAt(0);
                if (!rows[rowLetter]) {
                    rows[rowLetter] = [];
                }
                rows[rowLetter].push(seat);
            });

            this.seatRows = Object.values(rows);
        },
        cancelBooking() {
            console.log("Booking cancelled");
            this.selectedSeats = [];
        },
        proceedBooking() {
    if (this.selectedSeats.length === 0) return;

    // Get movie ID from URL
    const movieId = new URLSearchParams(window.location.search).get('movie_id');

    // Redirect to booking summary with movie ID and seats as JSON
    this.$inertia.get('/booking-summary', {
        movie_id: movieId, 
        seats: JSON.stringify(this.selectedSeats) // Convert to JSON string
    });
}

    }
};
</script>

<style>
/* General Container */
.cinema-container {
    text-align: center;
    padding: 20px;
    background-color: #1a1a1a;
    color: white;
}

/* Title */
.title {
    font-size: 24px;
    margin-bottom: 10px;
}

/* Screen */
.screen {
    background-color: white;
    color: black;
    padding: 10px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    width: 60%;
    margin: 20px auto;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(255, 255, 255, 0.1);
}

/* Seating Layout */
.seating {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

/* Seat Row */
.row {
    display: flex;
    gap: 8px;
}

/* Seat Buttons */
button {
    width: 40px;
    height: 40px;
    font-size: 14px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

/* Seat Status */
.available {
    background-color: green;
    color: white;
}
.locked-by-me {
    background-color: red;
    color: white;
}
.locked-by-others {
    background-color: #444;
    color: white;
    cursor: not-allowed;
}
.booked {
    background-color: gray;
    color: white;
}

/* Selected Seats Section */
.selected-seats {
    text-align: center;
    margin-top: 20px;
    font-size: 16px;
}

/* Centered Action Buttons */
.action-buttons {
    display: flex;
    justify-content: center;
    gap: 100px;
    margin-top: 20px;
}

/* Cancel & Proceed Buttons */
.cancel-button, .proceed-button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

.cancel-button {
    background-color: gray;
    color: white;
}

.proceed-button {
    background-color: red;
    color: white;
}

.proceed-button:disabled {
    background-color: #444;
    cursor: not-allowed;
}
</style>
