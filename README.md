# 🎬 Cinema Booking API

A RESTful API for managing movie listings, ticket bookings, food & beverage orders, and payments. Built with Laravel, Swagger (OpenAPI), and MySQL.

---

## 🚀 Features

- Browse movies
- Book movie tickets with seat selection
- Add food and beverages to bookings
- Checkout and confirm payment
- Fully documented with Swagger UI

---

## 🛠 Installation

```bash

# Install dependencies
composer install
php artisan key:generate

#db
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cinema_booking
DB_USERNAME=root
DB_PASSWORD=

# Configure your DB in .env
php artisan migrate --seed

# (Optional) Install Swagger
composer require "darkaonline/l5-swagger"
php artisan vendor:publish --provider="L5Swagger\\L5SwaggerServiceProvider"
php artisan l5-swagger:generate

# Start local server
php artisan serve
