<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Login de funcionário
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'login' => 'required|string',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Busca o funcionário pelo login
            $employee = Employee::where('login', $request->login)->first();

            // Verifica se existe e se a senha está correta
            if (!$employee || !Hash::check($request->password, $employee->password)) {
                return response()->json([
                    'message' => 'Login ou senha incorretos'
                ], 401);
            }

            // Retorna os dados do funcionário (sem a senha)
            $employee->load('companies');
            
            return response()->json([
                'message' => 'Login realizado com sucesso',
                'employee' => $employee
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao realizar login',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Registro de novo funcionário
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'login' => 'required|string|max:255|unique:employees,login',
                'name' => 'required|string|max:255',
                'cpf' => 'required|string|size:11|unique:employees,cpf',
                'email' => 'required|email|unique:employees,email',
                'address' => 'required|string|max:255',
                'password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->only(['login', 'name', 'cpf', 'email', 'address']);
            $data['password'] = Hash::make($request->password);

            $employee = Employee::create($data);
            $employee->load('companies');

            return response()->json([
                'message' => 'Cadastro realizado com sucesso',
                'employee' => $employee
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao realizar cadastro',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
