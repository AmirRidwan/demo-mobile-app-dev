<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Bookings",
 *     description="Movie ticket booking operations"
 * )
 */
class BookingController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/bookings",
     *     tags={"Bookings"},
     *     summary="Get all bookings",
     *     @OA\Response(
     *         response=200,
     *         description="List of bookings"
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        return response()->json(Booking::with(['movie', 'foodItems'])->get(), 200);
    }
    /**
     * @OA\Post(
     *     path="/api/bookings",
     *     tags={"Bookings"},
     *     summary="Create a new booking",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"movie_id", "showtime", "seat_selection"},
     *             @OA\Property(property="movie_id", type="string", format="ulid"),
     *             @OA\Property(property="showtime", type="string", format="date-time"),
     *             @OA\Property(
     *                 property="seat_selection",
     *                 type="array",
     *                 @OA\Items(type="string")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=201, description="Booking created"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'movie_id' => 'required|ulid|exists:movies,id',
            'showtime' => 'required|date',
            'seat_selection' => 'required|array|min:1',
            'seat_selection.*' => 'string',
        ]);

        $booking = Booking::create([
            'movie_id' => $data['movie_id'],
            'showtime' => $data['showtime'],
            'seat_selection' => $data['seat_selection'],
            'status' => 'draft',
        ]);

        return response()->json($booking, 201);
    }
    /**
     * @OA\Get(
     *     path="/api/bookings/{id}",
     *     tags={"Bookings"},
     *     summary="Get a booking by ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Booking ID (ULID)",
     *         required=true,
     *         @OA\Schema(type="string", format="ulid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Booking details"
     *     ),
     *     @OA\Response(response=404, description="Booking not found")
     * )
     */
    public function show(string $id): JsonResponse
    {
        $booking = Booking::with(['movie', 'foodItems'])->findOrFail($id);
        return response()->json($booking, 200);
    }
    /**
     * @OA\Post(
     *     path="/api/bookings/{id}/food-beverage",
     *     tags={"Bookings"},
     *     summary="Add food and beverage to a booking",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Booking ID (ULID)",
     *         required=true,
     *         @OA\Schema(type="string", format="ulid")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"food_items"},
     *             @OA\Property(
     *                 property="food_items",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     required={"id", "quantity"},
     *                     @OA\Property(property="id", type="string", format="ulid"),
     *                     @OA\Property(property="quantity", type="integer", minimum=1)
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=200, description="Food added to booking"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function addFood(Request $request, string $id): JsonResponse
    {
        $booking = Booking::findOrFail($id);

        $data = $request->validate([
            'food_items' => 'required|array',
            'food_items.*.id' => 'required|ulid|exists:food_items,id',
            'food_items.*.quantity' => 'required|integer|min:1',
        ]);

        $syncData = [];
        foreach ($data['food_items'] as $item) {
            $syncData[$item['id']] = ['quantity' => $item['quantity']];
        }

        $booking->foodItems()->sync($syncData);

        return response()->json(['message' => 'Food added to booking.'], 200);
    }
}

