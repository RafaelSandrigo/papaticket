<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\RaceResource;
use App\Http\Resources\RegistrationResource;
use App\Models\Race;
use Illuminate\Support\Facades\Gate;

class RaceRegistrationController extends Controller
{
    public function index(Race $race)
    {
        Gate::authorize('view', $race);

        $registrations = $race->registrations()
            ->with('user.runnerProfile')
            ->orderBy('status')
            ->latest('registered_at')
            ->get();

        return RegistrationResource::collection($registrations)->additional([
            'race' => new RaceResource($race->loadCount('confirmedRegistrations')),
        ]);
    }
}
