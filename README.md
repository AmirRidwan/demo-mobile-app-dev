
### Setup Instruction
- Clone project using `git clone https://github.com/Amirasyraf222/demo-mobile-app-dev.git`
- Run `composer install` 
- Run `npm install`
- Create database name `cinemaSime` on your local
- Rename `.env.example` to `.env`
- Change DB_Database in ENV to `cinemaSime`

- Copy this :
   `BROADCAST_DRIVER=pusher
    PUSHER_APP_ID=local
    PUSHER_APP_KEY=local
    PUSHER_APP_SECRET=local
    PUSHER_HOST=127.0.0.1
    PUSHER_PORT=6001` 
  and paste in the `ENV` file

- Run `php artisan migrate:fresh --seed` to migrate database 
- Run `php artisan key:generate` to generate key if required

- Run `php artisan serve` to run the backend
- Run `npm run dev` to run the frontend
- Run `php artisan websockets:serve` to start the websocket service

- Serve `http://127.0.0.1:8000/` in two browser with two different users
- Choose `Spiderman` movie 
- Search `http://127.0.0.1:8000/laravel-websockets` and click connect to view the working   websocket


### Information :
    - This is to demo the use of websocket in real time seat locking



