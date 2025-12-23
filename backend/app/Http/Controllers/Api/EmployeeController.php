<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    /**
     * Retorna todos os funcionários com suas empresas
     */
    public function index(): JsonResponse
    {
        try {
            $employees = Employee::with('companies')->get();
            return response()->json($employees, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching employees',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria um novo funcionário
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'login' => 'required|string|max:255|unique:employees,login',
                'name' => 'required|string|max:255',
                'cpf' => 'required|string|size:11|unique:employees,cpf',
                'email' => 'required|email|unique:employees,email',
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
                $path = $request->file('document')->store('documents/employees', 'public');
                $data['document_path'] = $path;
            }

            $employee = Employee::create($data);

            // Sincroniza empresas se fornecidas
            if ($request->has('company_ids')) {
                $employee->companies()->sync($request->company_ids);
            }

            $employee->load('companies');

            return response()->json($employee, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating employee',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna um funcionário específico com suas empresas
     */
    public function show(string $id): JsonResponse
    {
        try {
            $employee = Employee::with('companies')->find($id);

            if (!$employee) {
                return response()->json([
                    'message' => 'Employee not found'
                ], 404);
            }

            return response()->json($employee, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching employee',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza um funcionário
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $employee = Employee::find($id);

            if (!$employee) {
                return response()->json([
                    'message' => 'Employee not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'login' => 'sometimes|required|string|max:255|unique:employees,login,' . $id,
                'name' => 'sometimes|required|string|max:255',
                'cpf' => 'sometimes|required|string|size:11|unique:employees,cpf,' . $id,
                'email' => 'sometimes|required|email|unique:employees,email,' . $id,
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
                if ($employee->document_path) {
                    Storage::disk('public')->delete($employee->document_path);
                }
                $path = $request->file('document')->store('documents/employees', 'public');
                $data['document_path'] = $path;
            }

            $employee->update($data);

            // Sincroniza empresas se fornecidas
            if ($request->has('company_ids')) {
                $employee->companies()->sync($request->company_ids);
            }

            $employee->load('companies');

            return response()->json($employee, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating employee',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove um funcionário
     */
    public function destroy(string $id, Request $request): JsonResponse
    {
        try {
            $employee = Employee::find($id);

            if (!$employee) {
                return response()->json([
                    'message' => 'Employee not found'
                ], 404);
            }

            // Impede que o usuário logado delete a si próprio
            $currentUser = $request->input('current_user_id');
            if ($currentUser && $employee->id == $currentUser) {
                return response()->json([
                    'message' => 'You cannot delete yourself. Please contact an administrator.'
                ], 403);
            }

            // Remove documento se existir
            if ($employee->document_path) {
                Storage::disk('public')->delete($employee->document_path);
            }

            $employee->delete();

            return response()->json([
                'message' => 'Employee deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting employee',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
