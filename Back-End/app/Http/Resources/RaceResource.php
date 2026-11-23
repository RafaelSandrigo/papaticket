<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RaceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'distance_km' => (float) $this->distance_km,
            'city' => $this->city,
            'state' => $this->state,
            'start_location' => $this->start_location,
            'starts_at' => $this->starts_at->format('Y-m-d\TH:i'),
            'registration_deadline' => $this->registration_deadline->format('Y-m-d'),
            'max_participants' => $this->max_participants,
            'price' => (float) $this->price,
            'status' => $this->status,
            'registered_count' => $this->max_participants - $this->availableSpots(),
            'available_spots' => $this->availableSpots(),
            'registration_open' => $this->registrationOpen(),
            'organizer' => $this->whenLoaded('organizer', fn () => $this->organizer->organizerProfile?->organization_name ?? $this->organizer->name),
        ];
    }
}
