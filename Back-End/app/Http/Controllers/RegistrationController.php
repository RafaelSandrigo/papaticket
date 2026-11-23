<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRegistrationRequest;
use App\Http\Resources\RegistrationResource;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class RegistrationController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Registration::class);

        $registrations = $request->user()->registrations()
            ->with(['race' => fn ($query) => $query->withCount('confirmedRegistrations')])
            ->latest('registered_at')
            ->get();

        return RegistrationResource::collection($registrations);
    }

    public function store(StoreRegistrationRequest $request)
    {
        $registration = Registration::updateOrCreate(
            ['user_id' => $request->user()->id, 'race_id' => $request->race_id],
            ['status' => 'confirmed', 'shirt_size' => $request->shirt_size, 'registered_at' => now()],
        );

        return (new RegistrationResource($registration->load('race')))
            ->response()
            ->setStatusCode(201);
    }

    public function destroy(Registration $registration)
    {
        Gate::authorize('delete', $registration);

        if ($registration->status === 'cancelled') {
            throw ValidationException::withMessages(['registration' => 'Esta inscrição já está cancelada.']);
        }

        if ($registration->race->registration_deadline->copy()->endOfDay()->isPast()) {
            throw ValidationException::withMessages(['registration' => 'O prazo para cancelar esta inscrição já terminou.']);
        }

        $registration->update(['status' => 'cancelled']);

        return new RegistrationResource($registration->load('race'));
    }
}
