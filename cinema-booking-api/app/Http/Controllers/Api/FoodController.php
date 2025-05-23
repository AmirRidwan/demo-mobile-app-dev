<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FoodItem;
use Illuminate\Http\JsonResponse;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Food & Beverages",
 *     description="Endpoints to view available food and beverage items"
 * )
 */
class FoodController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/food-beverage-options",
     *     tags={"Food & Beverages"},
     *     summary="Get list of available food and beverage options",
     *     description="Returns all food and beverage items that can be added to a booking",
     *     @OA\Response(
     *         response=200,
     *         description="List of food items",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="string", format="ulid"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="price", type="number", format="float")
     *             )
     *         )
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        return response()->json(FoodItem::all(), 200);
    }
}

