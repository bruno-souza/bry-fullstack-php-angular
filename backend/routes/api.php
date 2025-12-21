<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\CustomerController;

/**
 * Rotas da API REST
 * Todas as rotas aqui são prefixadas com /api
 */

// Rotas de Companies
Route::apiResource('companies', CompanyController::class);

// Rotas de Employees
Route::apiResource('employees', EmployeeController::class);

// Rotas de Customers
Route::apiResource('customers', CustomerController::class);
