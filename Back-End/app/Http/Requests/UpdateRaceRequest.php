<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('race'));
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'state' => strtoupper((string) $this->state),
        ]);
    }

    public function rules(): array
    {
        $confirmed = $this->route('race')->confirmedRegistrations()->count();

        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'distance_km' => ['required', 'numeric', 'min:0.1', 'max:500'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'alpha', 'size:2'],
            'start_location' => ['required', 'string', 'max:255'],
            'starts_at' => ['required', 'date'],
            'registration_deadline' => ['required', 'date', 'before_or_equal:starts_at'],
            'max_participants' => ['required', 'integer', 'min:'.max(1, $confirmed)],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}
