<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = [
            [
                'name' => 'Tech Solutions Brasil',
                'cnpj' => '12345678000190',
                'address' => 'Av. Paulista, 1000 - Sao Paulo, SP',
            ],
            [
                'name' => 'Comercio Digital Ltda',
                'cnpj' => '98765432000111',
                'address' => 'Rua das Flores, 250 - Rio de Janeiro, RJ',
            ],
            [
                'name' => 'Servicos Administrativos SA',
                'cnpj' => '11223344000155',
                'address' => 'Av. Brasil, 500 - Belo Horizonte, MG',
            ],
        ];

        foreach ($companies as $company) {
            Company::create($company);
        }
    }
}
