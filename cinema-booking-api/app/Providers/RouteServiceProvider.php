<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any route services.
     */
    public function boot(): void
    {
        // Register API Routes
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        // Register Web Routes
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    }
}

