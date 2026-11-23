<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isOrganizer(): bool
    {
        return $this->role === 'organizer';
    }

    public function isRunner(): bool
    {
        return $this->role === 'runner';
    }

    public function runnerProfile(): HasOne
    {
        return $this->hasOne(RunnerProfile::class);
    }

    public function organizerProfile(): HasOne
    {
        return $this->hasOne(OrganizerProfile::class);
    }

    public function organizedRaces(): HasMany
    {
        return $this->hasMany(Race::class, 'organizer_id');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

    public function races(): BelongsToMany
    {
        return $this->belongsToMany(Race::class, 'registrations')
            ->using(Registration::class)
            ->withPivot(['id', 'status', 'shirt_size', 'registered_at'])
            ->withTimestamps();
    }
}
