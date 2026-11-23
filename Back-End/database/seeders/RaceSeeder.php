<?php

namespace Database\Seeders;

use App\Models\Registration;
use App\Models\User;
use Illuminate\Database\Seeder;

class RaceSeeder extends Seeder
{
    public function run(): void
    {
        $organizer = User::where('role', 'organizer')->first();
        $runners = User::where('role', 'runner')->orderBy('id')->get();

        $races = [
            'noturna' => [
                'name' => 'Corrida Noturna da Paulista',
                'description' => 'Percurso plano pela Avenida Paulista com largada ao pôr do sol, iluminação especial e hidratação a cada 2 km.',
                'distance_km' => 5,
                'city' => 'São Paulo',
                'state' => 'SP',
                'start_location' => 'MASP - Av. Paulista, 1578',
                'starts_at' => now()->addDays(20)->setTime(19, 30),
                'registration_deadline' => now()->addDays(15),
                'max_participants' => 300,
                'price' => 79.90,
                'status' => 'active',
            ],
            'meia' => [
                'name' => 'Meia Maratona das Praias',
                'description' => 'Meia maratona à beira-mar passando pelas principais praias da cidade. Percurso certificado.',
                'distance_km' => 21.1,
                'city' => 'Santos',
                'state' => 'SP',
                'start_location' => 'Orla do Gonzaga',
                'starts_at' => now()->addDays(45)->setTime(6, 0),
                'registration_deadline' => now()->addDays(35),
                'max_participants' => 500,
                'price' => 149.90,
                'status' => 'active',
            ],
            'parque' => [
                'name' => 'Desafio 10K do Parque',
                'description' => 'Prova de 10 km com trechos de subida dentro do parque. Ideal para quem quer testar o ritmo.',
                'distance_km' => 10,
                'city' => 'Curitiba',
                'state' => 'PR',
                'start_location' => 'Parque Barigui - Portão principal',
                'starts_at' => now()->addDays(30)->setTime(7, 0),
                'registration_deadline' => now()->addDays(25),
                'max_participants' => 200,
                'price' => 99.90,
                'status' => 'active',
            ],
            'ultimas' => [
                'name' => 'Corrida Últimas Vagas',
                'description' => 'Prova com vagas limitadíssimas pelas ruas do centro histórico.',
                'distance_km' => 7,
                'city' => 'Campinas',
                'state' => 'SP',
                'start_location' => 'Largo do Rosário',
                'starts_at' => now()->addDays(12)->setTime(7, 30),
                'registration_deadline' => now()->addDays(10),
                'max_participants' => 3,
                'price' => 59.90,
                'status' => 'active',
            ],
            'serra' => [
                'name' => 'Rústica da Serra',
                'description' => 'Corrida de 15 km em estrada de terra com vista para a serra. Inscrições já encerradas.',
                'distance_km' => 15,
                'city' => 'Campos do Jordão',
                'state' => 'SP',
                'start_location' => 'Praça do Capivari',
                'starts_at' => now()->addDays(5)->setTime(8, 0),
                'registration_deadline' => now()->subDays(2),
                'max_participants' => 150,
                'price' => 120.00,
                'status' => 'active',
            ],
            'inverno' => [
                'name' => 'Corrida de Inverno',
                'description' => 'Prova ainda em planejamento, por isso está inativa.',
                'distance_km' => 8,
                'city' => 'Gramado',
                'state' => 'RS',
                'start_location' => 'Rua Coberta',
                'starts_at' => now()->addDays(60)->setTime(8, 0),
                'registration_deadline' => now()->addDays(50),
                'max_participants' => 250,
                'price' => 89.90,
                'status' => 'inactive',
            ],
            'primavera' => [
                'name' => 'Corrida da Primavera',
                'description' => 'Edição que já aconteceu. Aparece apenas no painel do organizador.',
                'distance_km' => 5,
                'city' => 'Belo Horizonte',
                'state' => 'MG',
                'start_location' => 'Lagoa da Pampulha',
                'starts_at' => now()->subDays(10)->setTime(7, 0),
                'registration_deadline' => now()->subDays(15),
                'max_participants' => 400,
                'price' => 69.90,
                'status' => 'active',
            ],
        ];

        $created = [];

        foreach ($races as $key => $race) {
            $created[$key] = $organizer->organizedRaces()->create($race);
        }

        $registrations = [
            [0, 'noturna', 'M', 'confirmed'],
            [0, 'meia', 'P', 'confirmed'],
            [3, 'noturna', 'G', 'cancelled'],
            [0, 'ultimas', 'M', 'confirmed'],
            [1, 'ultimas', 'G', 'confirmed'],
            [2, 'serra', 'P', 'confirmed'],
            [1, 'primavera', 'GG', 'confirmed'],
            [1, 'parque', 'G', 'confirmed'],
        ];

        foreach ($registrations as [$runner, $race, $size, $status]) {
            Registration::create([
                'user_id' => $runners[$runner]->id,
                'race_id' => $created[$race]->id,
                'shirt_size' => $size,
                'status' => $status,
                'registered_at' => now()->subDays(rand(1, 20)),
            ]);
        }
    }
}
