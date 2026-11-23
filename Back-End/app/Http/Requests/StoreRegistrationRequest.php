<?php

namespace App\Http\Requests;

use App\Models\Race;
use App\Models\Registration;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Registration::class);
    }

    public function rules(): array
    {
        return [
            'race_id' => ['required', 'integer', 'exists:races,id'],
            'shirt_size' => ['required', 'in:PP,P,M,G,GG,XG'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $race = Race::find($this->race_id);

                if (! $race->registrationOpen()) {
                    $validator->errors()->add('race_id', 'As inscrições para esta corrida estão encerradas.');

                    return;
                }

                $alreadyRegistered = $race->confirmedRegistrations()
                    ->where('user_id', $this->user()->id)
                    ->exists();

                if ($alreadyRegistered) {
                    $validator->errors()->add('race_id', 'Você já está inscrito nesta corrida.');

                    return;
                }

                if ($race->availableSpots() === 0) {
                    $validator->errors()->add('race_id', 'Não há mais vagas para esta corrida.');
                }
            },
        ];
    }
}
