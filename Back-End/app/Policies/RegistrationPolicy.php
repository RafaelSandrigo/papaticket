<?php

namespace App\Policies;

use App\Models\Registration;
use App\Models\User;

class RegistrationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isRunner();
    }

    public function create(User $user): bool
    {
        return $user->isRunner();
    }

    public function delete(User $user, Registration $registration): bool
    {
        return $user->isRunner() && $registration->user_id === $user->id;
    }
}
