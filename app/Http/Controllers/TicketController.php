<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function bookTicket($id)
    {
        $locations = json_decode(file_get_contents(public_path('/json/cinema-location.json')));

        // dd($locations);

        return Inertia::render('book-ticket', [
            'locations' => $locations
        ]);
    }
}
