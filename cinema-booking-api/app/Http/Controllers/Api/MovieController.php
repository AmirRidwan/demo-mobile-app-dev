<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\JsonResponse;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Movies",
 *     description="API Endpoints for Movies"
 * )
 */
class MovieController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/movies",
     *     tags={"Movies"},
     *     summary="List all movies",
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        return response()->json(Movie::all(), 200);
    }

    /**
     * @OA\Get(
     *     path="/api/movies/{id}",
     *     tags={"Movies"},
     *     summary="Get a movie by ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string", format="ulid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Movie found"
     *     ),
     *     @OA\Response(response=404, description="Not found")
     * )
     */
    public function show(string $id): JsonResponse
    {
        $movie = Movie::findOrFail($id);
        return response()->json($movie, 200);
    }
}

