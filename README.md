
### Setup Instruction
- Clone project using `git clone https://github.com/Amirasyraf222/asia-quest.git`
- Run `composer install` 
- Create database name `asia_quest` on your local
- Rename `.env.example` to `.env`
- Run `php artisan migrate` to migrate database 
- Run `php artisan db:seed --class=UserSeeder` to seed the user data in database
- Run `php artisan key:generate` to generate key if required
- Run `php artisan serve` to run the system

- Search `http://127.0.0.1:8000/api/users` to view on all data
- Search `http://127.0.0.1:8000/api/users?limit=5&page=2` to view on limit and page
- Search `http://127.0.0.1:8000/users` to view on web view


- Flow :
    1. Create User migration with additional field ('location')
    2. Create database seeder to seed User data
    3. Create controller to handle logic of fetching data
    4. Create route for the api
    6. Deploy app 



