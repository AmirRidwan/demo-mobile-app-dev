<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Payments",
 *     description="Endpoints for payment processing and booking confirmation"
 * )
 */
class PaymentController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/bookings/{id}/checkout",
     *     tags={"Payments"},
     *     summary="Get a booking summary before payment",
     *     description="Returns movie title, seat selection, selected food, and total cost",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Booking ID (ULID)",
     *         @OA\Schema(type="string", format="ulid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Booking summary with total",
     *         @OA\JsonContent(
     *             @OA\Property(property="booking_id", type="string", format="ulid"),
     *             @OA\Property(property="movie", type="string"),
     *             @OA\Property(property="seats", type="array", @OA\Items(type="string")),
     *             @OA\Property(
     *                 property="food",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="string"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="price", type="number", format="float"),
     *                     @OA\Property(property="pivot", type="object",
     *                         @OA\Property(property="quantity", type="integer")
     *                     )
     *                 )
     *             ),
     *             @OA\Property(property="total", type="number", format="float")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Booking not found")
     * )
     */
    public function checkout(string $id): JsonResponse
    {
        $booking = Booking::with('foodItems', 'movie')->findOrFail($id);

        $total = 0;
        foreach ($booking->foodItems as $item) {
            $total += $item->price * $item->pivot->quantity;
        }

        return response()->json([
            'booking_id' => $booking->id,
            'movie' => $booking->movie->title,
            'seats' => $booking->seat_selection,
            'food' => $booking->foodItems,
            'total' => $total,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/bookings/{id}/confirm-payment",
     *     tags={"Payments"},
     *     summary="Confirm a booking and create a payment record",
     *     description="Processes payment and updates booking status to confirmed",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Booking ID (ULID)",
     *         @OA\Schema(type="string", format="ulid")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"payment_method"},
     *             @OA\Property(property="payment_method", type="string", enum={"card", "online_banking", "ewallet"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Payment processed and booking confirmed",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="amount", type="number", format="float")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Booking not found"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function confirm(Request $request, string $id): JsonResponse
    {
        $booking = Booking::with('foodItems')->findOrFail($id);

        $validated = $request->validate([
            'payment_method' => 'required|in:card,online_banking,ewallet',
        ]);

        $total = 0;
        foreach ($booking->foodItems as $item) {
            $total += $item->price * $item->pivot->quantity;
        }

        $booking->update([
            'status' => 'confirmed',
            'total_amount' => $total,
        ]);

        Payment::create([
            'booking_id' => $booking->id,
            'payment_method' => $validated['payment_method'],
            'payment_reference' => 'TRX-' . strtoupper(uniqid()),
            'amount' => $total,
            'paid_at' => now(),
        ]);

        return response()->json([
            'message' => 'Booking confirmed',
            'amount' => $total,
        ]);
    }
}
