<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'runner_profile' => new RunnerProfileResource($this->whenLoaded('runnerProfile')),
            'organizer_profile' => new OrganizerProfileResource($this->whenLoaded('organizerProfile')),
        ];
    }
}
