<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegistrationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'shirt_size' => $this->shirt_size,
            'registered_at' => $this->registered_at->format('Y-m-d\TH:i'),
            'race' => new RaceResource($this->whenLoaded('race')),
            'runner' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
