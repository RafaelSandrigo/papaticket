<?php

namespace App\Policies;

use App\Models\Race;
use App\Models\User;

class RacePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isOrganizer();
    }

    public function view(User $user, Race $race): bool
    {
        return $this->owns($user, $race);
    }

    public function create(User $user): bool
    {
        return $user->isOrganizer();
    }

    public function update(User $user, Race $race): bool
    {
        return $this->owns($user, $race);
    }

    public function delete(User $user, Race $race): bool
    {
        return $this->owns($user, $race);
    }

    private function owns(User $user, Race $race): bool
    {
        return $user->isOrganizer() && $race->organizer_id === $user->id;
    }
}
