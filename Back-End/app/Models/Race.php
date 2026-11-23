<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Race extends Model
{
    protected $fillable = [
        'organizer_id',
        'name',
        'description',
        'distance_km',
        'city',
        'state',
        'start_location',
        'starts_at',
        'registration_deadline',
        'max_participants',
        'price',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'distance_km' => 'decimal:2',
            'price' => 'decimal:2',
            'starts_at' => 'datetime',
            'registration_deadline' => 'date',
            'max_participants' => 'integer',
        ];
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

    public function confirmedRegistrations(): HasMany
    {
        return $this->registrations()->where('status', 'confirmed');
    }

    public function runners(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'registrations')
            ->using(Registration::class)
            ->withPivot(['id', 'status', 'shirt_size', 'registered_at'])
            ->withTimestamps();
    }

    public function scopeAvailable(Builder $query): void
    {
        $query->where('status', 'active')->where('starts_at', '>', now());
    }

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query
            ->when($filters['name'] ?? null, fn ($q, $name) => $q->where('name', 'like', "%{$name}%"))
            ->when($filters['date_from'] ?? null, fn ($q, $date) => $q->whereDate('starts_at', '>=', $date))
            ->when($filters['date_to'] ?? null, fn ($q, $date) => $q->whereDate('starts_at', '<=', $date))
            ->when($filters['km_min'] ?? null, fn ($q, $km) => $q->where('distance_km', '>=', $km))
            ->when($filters['km_max'] ?? null, fn ($q, $km) => $q->where('distance_km', '<=', $km));
    }

    public function availableSpots(): int
    {
        $confirmed = $this->confirmed_registrations_count ?? $this->confirmedRegistrations()->count();

        return max(0, $this->max_participants - $confirmed);
    }

    public function registrationOpen(): bool
    {
        return $this->status === 'active'
            && $this->registration_deadline->copy()->endOfDay()->isFuture()
            && $this->starts_at->isFuture();
    }
}
