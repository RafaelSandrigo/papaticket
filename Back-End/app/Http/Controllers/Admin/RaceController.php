<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRaceRequest;
use App\Http\Requests\UpdateRaceRequest;
use App\Http\Resources\RaceResource;
use App\Models\Race;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class RaceController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Race::class);

        $races = $request->user()->organizedRaces()
            ->withCount('confirmedRegistrations')
            ->orderByDesc('starts_at')
            ->get();

        return RaceResource::collection($races);
    }

    public function store(StoreRaceRequest $request)
    {
        $race = $request->user()->organizedRaces()->create($request->validated());

        return (new RaceResource($race->loadCount('confirmedRegistrations')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Race $race)
    {
        Gate::authorize('view', $race);

        return new RaceResource($race->loadCount('confirmedRegistrations'));
    }

    public function update(UpdateRaceRequest $request, Race $race)
    {
        $race->update($request->validated());

        return new RaceResource($race->loadCount('confirmedRegistrations'));
    }

    public function destroy(Race $race)
    {
        Gate::authorize('delete', $race);

        if ($race->confirmedRegistrations()->exists()) {
            throw ValidationException::withMessages([
                'race' => 'Esta corrida possui inscritos e não pode ser excluída. Inative a corrida.',
            ]);
        }

        $race->delete();

        return response()->noContent();
    }
}
