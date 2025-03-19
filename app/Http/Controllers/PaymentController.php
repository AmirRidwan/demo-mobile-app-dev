<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function paymentSuccess(Request $request)
    {

        // dd($request->seats);

        $selected_seats = $request->seats;

        // get json file
        $seats_res = Http::withHeaders([
            'X-Master-Key' => '$2a$10$LqyWb2CiHK5f/ca.WPQ5q.LmdrBLjOEADLJWK7prLG7xjqq7gZbWW',
            'X-Access-Key' => '$2a$10$q/w/8.aWvxBkgTgh7iB6.OKhUHJv7BPJsFYLwW3ClVLC6Qzm97AAC',
            'accept' => 'application/json',
        ])->get('https://api.jsonbin.io/v3/b/67d935528960c979a574098a')->json();


        // dd(json_encode($seats_res['record']));

        // book seats
        foreach ($seats_res['record'] as $key => $seat) {
            if (in_array($seat['id'], $selected_seats)) {
                $seats_res['record'][$key]['status'] = "booked";
            }
        }

        $new_seats = json_encode($seats_res['record']);


        // dd($new_seats);
        $post_seats = Http::withHeaders([
            'X-Master-Key' => '$2a$10$LqyWb2CiHK5f/ca.WPQ5q.LmdrBLjOEADLJWK7prLG7xjqq7gZbWW',
            'X-Access-Key' => '$2a$10$q/w/8.aWvxBkgTgh7iB6.OKhUHJv7BPJsFYLwW3ClVLC6Qzm97AAC',
            'Content-Type' => 'application/json',
        ])->put(
            'https://api.jsonbin.io/v3/b/67d935528960c979a574098a',
            json_decode($new_seats)
        );


        return Inertia::render('payment-success');
    }
}
