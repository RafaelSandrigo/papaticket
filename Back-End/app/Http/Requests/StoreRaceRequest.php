<?php

namespace App\Http\Requests;

use App\Models\Race;
use Illuminate\Foundation\Http\FormRequest;

class StoreRaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Race::class);
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'state' => strtoupper((string) $this->state),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'distance_km' => ['required', 'numeric', 'min:0.1', 'max:500'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'alpha', 'size:2'],
            'start_location' => ['required', 'string', 'max:255'],
            'starts_at' => ['required', 'date', 'after:now'],
            'registration_deadline' => ['required', 'date', 'before_or_equal:starts_at'],
            'max_participants' => ['required', 'integer', 'min:1'],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}
