<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrganizerProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isOrganizer();
    }

    public function rules(): array
    {
        return [
            'organization_name' => ['required', 'string', 'max:255'],
            'document' => ['required', 'string', 'max:18'],
            'phone' => ['required', 'string', 'max:20'],
        ];
    }
}
