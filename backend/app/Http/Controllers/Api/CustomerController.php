<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class CustomerController extends Controller
{
    /**
     * Retorna todos os clientes com suas empresas
     */
    public function index(): JsonResponse
    {
        try {
            $customers = Customer::with('companies')->get();
            return response()->json($customers, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching customers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria um novo cliente
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'login' => 'required|string|max:255|unique:customers,login',
                'name' => 'required|string|max:255',
                'cpf' => 'required|string|size:11|unique:customers,cpf',
                'email' => 'required|email|unique:customers,email',
                'address' => 'required|string|max:255',
                'password' => 'required|string|min:6',
                'document' => 'nullable|file|mimes:pdf,jpg,jpeg|max:2048',
                'company_ids' => 'nullable|array',
                'company_ids.*' => 'exists:companies,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->only(['login', 'name', 'cpf', 'email', 'address']);
            $data['password'] = Hash::make($request->password);

            // Upload do documento se fornecido
            if ($request->hasFile('document')) {
                $path = $request->file('document')->store('documents/customers', 'public');
                $data['document_path'] = $path;
            }

            $customer = Customer::create($data);

            // Sincroniza empresas se fornecidas
            if ($request->has('company_ids')) {
                $customer->companies()->sync($request->company_ids);
            }

            $customer->load('companies');

            return response()->json($customer, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna um cliente específico com suas empresas
     */
    public function show(string $id): JsonResponse
    {
        try {
            $customer = Customer::with('companies')->find($id);

            if (!$customer) {
                return response()->json([
                    'message' => 'Customer not found'
                ], 404);
            }

            return response()->json($customer, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza um cliente
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $customer = Customer::find($id);

            if (!$customer) {
                return response()->json([
                    'message' => 'Customer not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'login' => 'sometimes|required|string|max:255|unique:customers,login,' . $id,
                'name' => 'sometimes|required|string|max:255',
                'cpf' => 'sometimes|required|string|size:11|unique:customers,cpf,' . $id,
                'email' => 'sometimes|required|email|unique:customers,email,' . $id,
                'address' => 'sometimes|required|string|max:255',
                'password' => 'sometimes|required|string|min:6',
                'document' => 'nullable|file|mimes:pdf,jpg,jpeg|max:2048',
                'company_ids' => 'nullable|array',
                'company_ids.*' => 'exists:companies,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->only(['login', 'name', 'cpf', 'email', 'address']);
            
            if ($request->has('password')) {
                $data['password'] = Hash::make($request->password);
            }

            // Upload do documento se fornecido
            if ($request->hasFile('document')) {
                // Remove documento antigo se existir
                if ($customer->document_path) {
                    Storage::disk('public')->delete($customer->document_path);
                }
                $path = $request->file('document')->store('documents/customers', 'public');
                $data['document_path'] = $path;
            }

            $customer->update($data);

            // Sincroniza empresas se fornecidas
            if ($request->has('company_ids')) {
                $customer->companies()->sync($request->company_ids);
            }

            $customer->load('companies');

            return response()->json($customer, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove um cliente
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $customer = Customer::find($id);

            if (!$customer) {
                return response()->json([
                    'message' => 'Customer not found'
                ], 404);
            }

            // Remove documento se existir
            if ($customer->document_path) {
                Storage::disk('public')->delete($customer->document_path);
            }

            $customer->delete();

            return response()->json([
                'message' => 'Customer deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
