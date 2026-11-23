<?php

namespace App\Http\Controllers;

use App\Http\Resources\RaceResource;
use App\Models\Race;
use Illuminate\Http\Request;

class RaceController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date'],
            'km_min' => ['nullable', 'numeric', 'min:0'],
            'km_max' => ['nullable', 'numeric', 'min:0'],
        ]);

        $races = Race::available()
            ->filter($filters)
            ->withCount('confirmedRegistrations')
            ->orderBy('starts_at')
            ->get();

        return RaceResource::collection($races);
    }

    public function show(Race $race)
    {
        abort_if($race->status !== 'active', 404);

        $race->loadCount('confirmedRegistrations')->load('organizer.organizerProfile');

        return new RaceResource($race);
    }
}
