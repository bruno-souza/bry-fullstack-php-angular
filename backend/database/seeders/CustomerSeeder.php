<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customer;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            [
                'login' => 'rsousa',
                'name' => 'Roberto Sousa',
                'cpf' => '11122233344',
                'email' => 'roberto.sousa@email.com',
                'address' => 'Rua das Palmeiras, 100 - Sao Paulo, SP',
                'password' => Hash::make('123456'),
                'companies' => [1], // Tech Solutions Brasil
            ],
            [
                'login' => 'apereira',
                'name' => 'Amanda Pereira',
                'cpf' => '22233344455',
                'email' => 'amanda.pereira@email.com',
                'address' => 'Av. Atlantica, 200 - Rio de Janeiro, RJ',
                'password' => Hash::make('123456'),
                'companies' => [1], // Tech Solutions Brasil
            ],
            [
                'login' => 'bgomes',
                'name' => 'Bruno Gomes',
                'cpf' => '33344455566',
                'email' => 'bruno.gomes@email.com',
                'address' => 'Rua Sete de Setembro, 300 - Belo Horizonte, MG',
                'password' => Hash::make('123456'),
                'companies' => [1], // Tech Solutions Brasil
            ],
            [
                'login' => 'cdias',
                'name' => 'Camila Dias',
                'cpf' => '44455566677',
                'email' => 'camila.dias@email.com',
                'address' => 'Rua XV de Novembro, 400 - Sao Paulo, SP',
                'password' => Hash::make('123456'),
                'companies' => [2], // Comercio Digital
            ],
            [
                'login' => 'dribeiro',
                'name' => 'Diego Ribeiro',
                'cpf' => '55566677788',
                'email' => 'diego.ribeiro@email.com',
                'address' => 'Av. Copacabana, 500 - Rio de Janeiro, RJ',
                'password' => Hash::make('123456'),
                'companies' => [2], // Comercio Digital
            ],
            [
                'login' => 'emoraes',
                'name' => 'Eliane Moraes',
                'cpf' => '66677788899',
                'email' => 'eliane.moraes@email.com',
                'address' => 'Rua da Bahia, 600 - Belo Horizonte, MG',
                'password' => Hash::make('123456'),
                'companies' => [2], // Comercio Digital
            ],
            [
                'login' => 'falves',
                'name' => 'Fabio Alves',
                'cpf' => '77788899900',
                'email' => 'fabio.alves@email.com',
                'address' => 'Rua Augusta, 700 - Sao Paulo, SP',
                'password' => Hash::make('123456'),
                'companies' => [2], // Comercio Digital
            ],
            [
                'login' => 'gnunes',
                'name' => 'Gabriela Nunes',
                'cpf' => '88899900011',
                'email' => 'gabriela.nunes@email.com',
                'address' => 'Av. Vieira Souto, 800 - Rio de Janeiro, RJ',
                'password' => Hash::make('123456'),
                'companies' => [1, 2], // Tech Solutions e Comercio Digital
            ],
            [
                'login' => 'hcampos',
                'name' => 'Henrique Campos',
                'cpf' => '99900011122',
                'email' => 'henrique.campos@email.com',
                'address' => 'Rua Rio Grande do Sul, 900 - Belo Horizonte, MG',
                'password' => Hash::make('123456'),
                'companies' => [3], // Servicos Administrativos
            ],
            [
                'login' => 'imonteiro',
                'name' => 'Isabela Monteiro',
                'cpf' => '10011122233',
                'email' => 'isabela.monteiro@email.com',
                'address' => 'Av. Faria Lima, 1000 - Sao Paulo, SP',
                'password' => Hash::make('123456'),
                'companies' => [3], // Servicos Administrativos
            ],
            [
                'login' => 'jbarros',
                'name' => 'Jorge Barros',
                'cpf' => '20022233344',
                'email' => 'jorge.barros@email.com',
                'address' => 'Rua Barao de Ipanema, 1100 - Rio de Janeiro, RJ',
                'password' => Hash::make('123456'),
                'companies' => [3], // Servicos Administrativos
            ],
            [
                'login' => 'kteixeira',
                'name' => 'Karina Teixeira',
                'cpf' => '30033344455',
                'email' => 'karina.teixeira@email.com',
                'address' => 'Av. Assis Brasil, 1200 - Belo Horizonte, MG',
                'password' => Hash::make('123456'),
                'companies' => [1, 3], // Tech Solutions e Servicos Administrativos
            ],
            [
                'login' => 'lmiranda',
                'name' => 'Leonardo Miranda',
                'cpf' => '40044455566',
                'email' => 'leonardo.miranda@email.com',
                'address' => 'Rua Oscar Freire, 1300 - Sao Paulo, SP',
                'password' => Hash::make('123456'),
                'companies' => [2, 3], // Comercio Digital e Servicos Administrativos
            ],
            [
                'login' => 'mfonseca',
                'name' => 'Mariana Fonseca',
                'cpf' => '50055566677',
                'email' => 'mariana.fonseca@email.com',
                'address' => 'Av. Nossa Senhora de Copacabana, 1400 - Rio de Janeiro, RJ',
                'password' => Hash::make('123456'),
                'companies' => [1, 2, 3], // Todas as empresas
            ],
            [
                'login' => 'naraujo',
                'name' => 'Nicolas Araujo',
                'cpf' => '60066677788',
                'email' => 'nicolas.araujo@email.com',
                'address' => 'Rua Parana, 1500 - Belo Horizonte, MG',
                'password' => Hash::make('123456'),
                'companies' => [2], // Comercio Digital
            ],
        ];

        foreach ($customers as $customerData) {
            $companies = $customerData['companies'];
            unset($customerData['companies']);
            
            $customer = Customer::create($customerData);
            $customer->companies()->attach($companies);
        }
    }
}
