<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $organizer = User::create([
            'name' => 'Administrador PapaTicket',
            'email' => 'admin@papaticket.test',
            'password' => 'password',
            'role' => 'organizer',
        ]);

        $organizer->organizerProfile()->create([
            'organization_name' => 'PapaTicket Eventos Esportivos',
            'document' => '12.345.678/0001-90',
            'phone' => '(11) 3333-4444',
        ]);

        $runners = [
            ['Ana Souza', 'ana@papaticket.test', '52998224725', '1995-04-12', 'F', '(11) 98888-1111', 'Carlos Souza', '(11) 97777-1111'],
            ['Bruno Lima', 'bruno@papaticket.test', '16899535009', '1988-09-30', 'M', '(11) 98888-2222', 'Marta Lima', '(11) 97777-2222'],
            ['Carla Mendes', 'carla@papaticket.test', '45317828791', '2001-01-05', 'F', '(19) 98888-3333', 'Paulo Mendes', '(19) 97777-3333'],
            ['Diego Rocha', 'diego@papaticket.test', '71428793860', '1979-12-20', 'M', '(41) 98888-4444', 'Lúcia Rocha', '(41) 97777-4444'],
        ];

        foreach ($runners as [$name, $email, $cpf, $birthDate, $gender, $phone, $contactName, $contactPhone]) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => 'password',
                'role' => 'runner',
            ]);

            $user->runnerProfile()->create([
                'cpf' => $cpf,
                'birth_date' => $birthDate,
                'gender' => $gender,
                'phone' => $phone,
                'emergency_contact_name' => $contactName,
                'emergency_contact_phone' => $contactPhone,
            ]);
        }
    }
}
