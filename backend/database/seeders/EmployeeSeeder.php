<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            [
                'login' => 'jsilva',
                'name' => 'Joao Silva',
                'cpf' => '12345678901',
                'email' => 'joao.silva@email.com',
                'address' => 'Rua A, 123 - Sao Paulo, SP',
                'password' => Hash::make('123456'),
                'companies' => [1], // Tech Solutions Brasil
            ],
            [
                'login' => 'msantos',
                'name' => 'Maria Santos',
                'cpf' => '23456789012',
                'email' => 'maria.santos@email.com',
                'address' => 'Rua B, 456 - Sao Paulo, SP',
                'password' => Hash::make('123456'),
                'companies' => [1], // Tech Solutions Brasil
            ],
            [
                'login' => 'poliveira',
                'name' => 'Pedro Oliveira',
                'cpf' => '34567890123',
                'email' => 'pedro.oliveira@email.com',
                'address' => 'Av. Central, 789 - Rio de Janeiro, RJ',
                'password' => Hash::make('123456'),
                'companies' => [1, 2], // Tech Solutions e Comercio Digital
            ],
            [
                'login' => 'acosta',
                'name' => 'Ana Costa',
                'cpf' => '45678901234',
                'email' => 'ana.costa@email.com',
                'address' => 'Rua C, 321 - Rio de Janeiro, RJ',
                'password' => Hash::make('123456'),
                'companies' => [2], // Comercio Digital
            ],
            [
                'login' => 'rferreira',
                'name' => 'Ricardo Ferreira',
                'cpf' => '56789012345',
                'email' => 'ricardo.ferreira@email.com',
                'address' => 'Rua D, 654 - Belo Horizonte, MG',
                'password' => Hash::make('123456'),
                'companies' => [2, 3], // Comercio Digital e Servicos Administrativos
            ],
            [
                'login' => 'lalmeida',
                'name' => 'Lucia Almeida',
                'cpf' => '67890123456',
                'email' => 'lucia.almeida@email.com',
                'address' => 'Av. Afonso Pena, 987 - Belo Horizonte, MG',
                'password' => Hash::make('123456'),
                'companies' => [3], // Servicos Administrativos
            ],
            [
                'login' => 'crocha',
                'name' => 'Carlos Rocha',
                'cpf' => '78901234567',
                'email' => 'carlos.rocha@email.com',
                'address' => 'Rua E, 159 - Sao Paulo, SP',
                'password' => Hash::make('123456'),
                'companies' => [1], // Tech Solutions
            ],
            [
                'login' => 'jlima',
                'name' => 'Julia Lima',
                'cpf' => '89012345678',
                'email' => 'julia.lima@email.com',
                'address' => 'Rua F, 753 - Rio de Janeiro, RJ',
                'password' => Hash::make('123456'),
                'companies' => [2], // Comercio Digital
            ],
            [
                'login' => 'fmartins',
                'name' => 'Fernando Martins',
                'cpf' => '90123456789',
                'email' => 'fernando.martins@email.com',
                'address' => 'Av. Amazonas, 951 - Belo Horizonte, MG',
                'password' => Hash::make('123456'),
                'companies' => [3], // Servicos Administrativos
            ],
            [
                'login' => 'pcarvalho',
                'name' => 'Patricia Carvalho',
                'cpf' => '01234567890',
                'email' => 'patricia.carvalho@email.com',
                'address' => 'Rua G, 357 - Sao Paulo, SP',
                'password' => Hash::make('123456'),
                'companies' => [1, 3], // Tech Solutions e Servicos Administrativos
            ],
            [
                'login' => 'bry',
                'name' => 'Bry Tecnologia S.A',
                'cpf' => '10987654321',
                'email' => 'bry@example.com',
                'address' => 'Rua Lauro Linhares, 2010, torre B 8º andar, Trindade - 88036-002 Florianópolis-SC',
                'password' => Hash::make('123456'),
                'companies' => [1, 3], // Tech Solutions e Servicos Administrativos
            ],
        ];

        foreach ($employees as $employeeData) {
            $companies = $employeeData['companies'];
            unset($employeeData['companies']);

            $employee = Employee::create($employeeData);
            $employee->companies()->attach($companies);
        }
    }
}
