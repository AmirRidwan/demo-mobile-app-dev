<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MovieController extends Controller
{
    public function show($id)
    {
        return Inertia::render('movie');
    }
}
