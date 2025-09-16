
🎬 Demo Cinema Booking App by Amir Ridwan
=====================

A demo Flutter application for booking cinema tickets with **real-time seat selection** powered by WebSockets.\
This project demonstrates a full booking flow including select movie, seat locking, food & beverage selection, booking summary, and cancellation handling.

* * * * *

✨ Features
----------

-   🏠 Main Screen with 4 tabs: Home, My Tickets, Favorites, Profile

-   🎟️ Real-time Seat Selection

    -   Live updates across devices using WebSocket

    -   Seat locking/unlocking to prevent double booking

-   🍿 Food & Beverage Selection

    -   Choose snacks & drinks before checkout

-   📄 Booking Summary

    -   Review tickets, seats, and food

    -   Confirm or cancel booking (with confirmation dialog)

-   ⏱️ Booking Timer

    -   Timer starts after seat selection

    -   Auto-cancel booking when timer expires → returns user to Home

-   ⚡ WebSocket Auto Reconnect

    -   Works seamlessly on Android Emulator (`10.0.2.2`) and real devices

    -   Fallback to `localhost` for web/desktop

* * * * *

⚙️ Setup
--------

### 1\. Ensure you are in the project folder

```
cd cinema-booking-app

```

### 2\. Install dependencies

```
flutter pub get

```

* * * * *

🖥️ Running the WebSocket Server
--------------------------------

The app uses a WebSocket server for **real-time seat locking/unlocking**. A sample server is included in the `/server` folder.

### Steps to Run:

1.  Open a terminal and navigate to the `server` folder:

```
cd server

```

1.  Install dependencies (Node.js required):

```
npm install

```

1.  Start the WebSocket server:

```
node server.js

```

1.  Ensure the server URL matches your environment:

-   Android Emulator: `ws://10.0.2.2:8080`

-   Web/Desktop: `ws://localhost:8080`

-   Real Device: `ws://<your-ip>:8080` (device must be on the same WiFi network)

Once the server is running, launch the app and test **real-time seat selection**. The app will automatically connect and handle live updates.

* * * * *

🛠️ Tech Stack
--------------

-   Flutter (UI, State Management with Provider)

-   WebSocket (real-time seat updates)

* * * * * 

📸 Screenshots
--------------

### 🏠 Main Screen
<p>
  <img src="cinema_booking_app/assets/screenshots/home.png" width="250" alt="Home tab" />
  <img src="cinema_booking_app/assets/screenshots/ticket.png" width="250" alt="Ticket tab" />
  <img src="cinema_booking_app/assets/screenshots/ticket_tab.png" width="250" alt="Ticket tab" />
  <img src="cinema_booking_app/assets/screenshots/favorite.png" width="250" alt="Favorite tab" />
  <img src="cinema_booking_app/assets/screenshots/favorite_tab.png" width="250" alt="Favorite tab" />
  <img src="cinema_booking_app/assets/screenshots/profile.png" width="250" alt="Profile tab" />
</p>

### 🎫 Movie Details
<p>
  <img src="cinema_booking_app/assets/screenshots/movie_detail.png" width="250" alt="Movie detail" />
  <img src="cinema_booking_app/assets/screenshots/movie_detail_review.png" width="250" alt="Profile tab" />
</p>

### 🎟️ Ticket Booking
<p>
  <img src="cinema_booking_app/assets/screenshots/booking.png" width="250" alt="Ticket booking 1" />
  <img src="cinema_booking_app/assets/screenshots/booking_filled.png" width="250" alt="Ticket booking 2" />
  <img src="cinema_booking_app/assets/screenshots/booking_seat_selected.png" width="250" alt="Ticket booking 3" />
  <img src="cinema_booking_app/assets/screenshots/booking_seat_unavailable.png" width="250" alt="Ticket booking 4" />
</p>

### 🍿 Food & Beverage
<p>
  <img src="cinema_booking_app/assets/screenshots/fnb_1.png" width="250" alt="Food & Beverage 1" />
  <img src="cinema_booking_app/assets/screenshots/fnb_2.png" width="250" alt="Food & Beverage 2" />
</p>

### 📄 Booking Summary
<img src="cinema_booking_app/assets/screenshots/booking_summary.png" width="250" alt="Booking Summary" />

### 💳 Payment
<p>
  <img src="cinema_booking_app/assets/screenshots/payment_method.png" width="250" alt="Payment 1" />
  <img src="cinema_booking_app/assets/screenshots/card_payment.png" width="250" alt="Payment 2" />
  <img src="cinema_booking_app/assets/screenshots/bank_transfer.png" width="250" alt="Payment 3" />
  <img src="cinema_booking_app/assets/screenshots/e_wallet.png" width="250" alt="Payment 4" />
  <img src="cinema_booking_app/assets/screenshots/payment_success.png" width="250" alt="Payment sucess" />
  <img src="cinema_booking_app/assets/screenshots/view_ticket.png" width="250" alt="View ticket" />
</p>
