<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    /**
     * Retorna todas as empresas com funcionários e clientes
     */
    public function index(): JsonResponse
    {
        try {
            $companies = Company::with(['employees', 'customers'])->get();
            return response()->json($companies, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching companies',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria uma nova empresa
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'cnpj' => 'required|string|size:14|unique:companies,cnpj',
                'address' => 'required|string|max:255',
                'employee_ids' => 'nullable|array',
                'employee_ids.*' => 'exists:employees,id',
                'customer_ids' => 'nullable|array',
                'customer_ids.*' => 'exists:customers,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $company = Company::create($request->only(['name', 'cnpj', 'address']));

            // Sincroniza funcionários se fornecidos
            if ($request->has('employee_ids')) {
                $company->employees()->sync($request->employee_ids);
            }

            // Sincroniza clientes se fornecidos
            if ($request->has('customer_ids')) {
                $company->customers()->sync($request->customer_ids);
            }

            $company->load(['employees', 'customers']);

            return response()->json($company, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna uma empresa específica com funcionários e clientes
     */
    public function show(string $id): JsonResponse
    {
        try {
            $company = Company::with(['employees', 'customers'])->find($id);

            if (!$company) {
                return response()->json([
                    'message' => 'Company not found'
                ], 404);
            }

            return response()->json($company, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza uma empresa
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $company = Company::find($id);

            if (!$company) {
                return response()->json([
                    'message' => 'Company not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'cnpj' => 'sometimes|required|string|size:14|unique:companies,cnpj,' . $id,
                'address' => 'sometimes|required|string|max:255',
                'employee_ids' => 'nullable|array',
                'employee_ids.*' => 'exists:employees,id',
                'customer_ids' => 'nullable|array',
                'customer_ids.*' => 'exists:customers,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $company->update($request->only(['name', 'cnpj', 'address']));

            // Sincroniza funcionários se fornecidos
            if ($request->has('employee_ids')) {
                $company->employees()->sync($request->employee_ids);
            }

            // Sincroniza clientes se fornecidos
            if ($request->has('customer_ids')) {
                $company->customers()->sync($request->customer_ids);
            }

            $company->load(['employees', 'customers']);

            return response()->json($company, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove uma empresa
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $company = Company::find($id);

            if (!$company) {
                return response()->json([
                    'message' => 'Company not found'
                ], 404);
            }

            $company->delete();

            return response()->json([
                'message' => 'Company deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting company',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
