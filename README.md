# Sistema de Gerenciamento - Desafio Bry Tecnologia

Sistema completo de gerenciamento de Empresas, Funcionários e Clientes desenvolvido com Laravel (backend) e Angular (frontend).

## 📋 Descrição do Projeto

API REST para gerenciar empresas, funcionários e clientes com relacionamentos many-to-many, incluindo:
- CRUD completo de Empresas, Funcionários e Clientes
- Upload de documentos (PDF/JPG) para funcionários e clientes
- Relacionamentos many-to-many entre entidades
- Validações robustas e tratamento de erros
- Documentação automática da API com Scramble
- Interface web com Angular para consumo da API

## 🚀 Tecnologias Utilizadas

### Backend
- **PHP 8.2+**
- **Laravel 12** - Framework PHP
- **MySQL 8.0** - Banco de dados
- **Scramble** - Documentação automática OpenAPI 3.1

### Frontend
- **Angular 18** - Framework JavaScript
- **TypeScript** - Linguagem
- **RxJS** - Programação reativa

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **Nginx** - Servidor web para frontend

## 📦 Estrutura do Projeto

```
bry-fullstack-php-angular/
├── backend/              # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/  # Controllers da API
│   │   └── Models/                # Models Eloquent
│   ├── database/
│   │   └── migrations/            # Migrations do banco
│   ├── routes/
│   │   └── api.php               # Rotas da API
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/             # Aplicação Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/       # Componentes
│   │   │   ├── services/         # Services HTTP
│   │   │   ├── models/           # Interfaces TypeScript
│   │   │   └── validators/       # Validadores customizados
│   │   └── ...
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml    # Compose principal
```

## 🔧 Instalação e Execução

### Requisitos
- Docker
- Docker Compose

### Opção 1: Executar tudo com Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd bry-fullstack-php-angular

# Na raiz do projeto, suba todos os containers
docker-compose up -d --build

# Aguarde os containers iniciarem (30-60 segundos)
# O entrypoint automático irá:
# ✅ Criar o arquivo .env
# ✅ Gerar a chave da aplicação (APP_KEY)
# ✅ Aguardar o MySQL ficar disponível
# ✅ Executar as migrations automaticamente

# Acesse:
# Backend API: http://localhost:8000/api
# Documentação Scramble: http://localhost:8000/docs/api
# Frontend: http://localhost:4200
# MySQL: localhost:3306
```

**Verificar logs:**
```bash
# Ver logs do backend
docker-compose logs -f backend

# Ver logs do frontend
docker-compose logs -f frontend

# Ver logs do banco
docker-compose logs -f db
```

**Parar a aplicação:**
```bash
docker-compose down
```

### Opção 2: Executar Backend e Frontend separadamente

#### Backend

```bash
cd backend

# Build e iniciar containers
docker-compose up -d --build

# O entrypoint automático irá:
# ✅ Criar .env do .env.example (se não existir)
# ✅ Gerar APP_KEY automaticamente
# ✅ Aguardar MySQL inicializar
# ✅ Executar migrations automaticamente

# Verificar logs
docker-compose logs -f app

# Acessar API
# http://localhost:8000/api
# http://localhost:8000/docs/api
```

**Comandos úteis do backend:**
```bash
# Acessar container
docker-compose exec app bash

# Executar artisan commands
docker-compose exec app php artisan route:list
docker-compose exec app php artisan migrate:fresh

# Limpar caches
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
```

#### Frontend

```bash
cd frontend

# Opção A: Rodar com Docker
docker build -t bry-frontend .
docker run -p 4200:80 bry-frontend

# Opção B: Rodar em desenvolvimento (requer Node.js)
npm install
npm start

# Acessar aplicação
# http://localhost:4200
```

## 📚 Documentação da API

A documentação interativa da API está disponível em:
**http://localhost:8000/docs/api**

Powered by [Scramble](https://scramble.dedoc.co/) - Documentação automática OpenAPI 3.1

## 🛣️ Endpoints da API

### Companies (Empresas)

- `GET /api/companies` - Lista todas as empresas
- `POST /api/companies` - Cria uma nova empresa
- `GET /api/companies/{id}` - Exibe uma empresa específica
- `PUT /api/companies/{id}` - Atualiza uma empresa
- `DELETE /api/companies/{id}` - Remove uma empresa

**Campos:**
```json
{
  "name": "string (required)",
  "cnpj": "string (14 chars, required, unique)",
  "address": "string (required)",
  "employee_ids": "array (optional)",
  "customer_ids": "array (optional)"
}
```

### Employees (Funcionários)

- `GET /api/employees` - Lista todos os funcionários
- `POST /api/employees` - Cria um novo funcionário
- `GET /api/employees/{id}` - Exibe um funcionário específico
- `PUT /api/employees/{id}` - Atualiza um funcionário
- `DELETE /api/employees/{id}` - Remove um funcionário

**Campos:**
```json
{
  "login": "string (required, unique, no accents)",
  "name": "string (required, no accents)",
  "cpf": "string (11 chars, required, unique)",
  "email": "string (required, unique)",
  "address": "string (required)",
  "password": "string (min 6 chars, required)",
  "document": "file (pdf/jpg, optional, max 2MB)",
  "company_ids": "array (optional)"
}
```

### Customers (Clientes)

- `GET /api/customers` - Lista todos os clientes
- `POST /api/customers` - Cria um novo cliente
- `GET /api/customers/{id}` - Exibe um cliente específico
- `PUT /api/customers/{id}` - Atualiza um cliente
- `DELETE /api/customers/{id}` - Remove um cliente

**Campos:** (mesmos de Employees)

## ✅ Validações Implementadas

### Backend (Laravel)
- Validação de campos obrigatórios
- Validação de unicidade (CNPJ, CPF, email, login)
- Validação de tipos de arquivo (PDF/JPG)
- Validação de tamanho de arquivo (max 2MB)
- Tratamento de erros com códigos HTTP apropriados

### Frontend (Angular)
- **Validador customizado**: Impede acentuação nos campos `login` e `name`
- Validações de campos obrigatórios
- Feedback visual de erros
- **Interceptor HTTP**: Tratamento genérico de erros da API

## 🗄️ Banco de Dados

### Tabelas

- `companies` - Empresas
- `employees` - Funcionários
- `customers` - Clientes
- `company_employee` - Pivot (Many-to-Many)
- `company_customer` - Pivot (Many-to-Many)

### Relacionamentos

- Uma empresa pode ter vários funcionários
- Um funcionário pode pertencer a várias empresas
- Uma empresa pode ter vários clientes
- Um cliente pode pertencer a várias empresas

## 🔐 Variáveis de Ambiente

### Backend (.env)
```env
APP_NAME=BryAPI
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=laravel
```

## 🧪 Testando a API

Você pode testar a API usando:

1. **Documentação Scramble**: http://localhost:8000/docs/api (possui interface Try It)
2. **Postman**: Importe a collection `Bry-API.postman_collection.json`
3. **cURL**: Exemplos abaixo

### Exemplos cURL

```bash
# Criar uma empresa
curl -X POST http://localhost:8000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bry Tecnologia",
    "cnpj": "12345678901234",
    "address": "Rua Example, 123"
  }'

# Listar empresas
curl http://localhost:8000/api/companies

# Criar funcionário
curl -X POST http://localhost:8000/api/employees \
  -F "login=johndoe" \
  -F "name=John Doe" \
  -F "cpf=12345678901" \
  -F "email=john@example.com" \
  -F "address=Street 123" \
  -F "password=secret123" \
  -F "document=@/path/to/file.pdf" \
  -F "company_ids[]=1"
```

## 📝 Padrões de Código

### Backend
- Nomenclatura em **inglês** (tabelas, models, controllers)
- Comentários em **português**
- PSR-12 Code Style
- RESTful API design
- Repository pattern (opcional)

### Frontend
- Componentização
- Reactive forms
- Services para comunicação HTTP
- Interceptors para tratamento de erros
- Validadores customizados

## 🐛 Troubleshooting

### Erro: "Connection refused" ao acessar API
```bash
# Verifique se os containers estão rodando
docker-compose ps

# Reinicie os containers
docker-compose restart
```

### Erro: "Table doesn't exist"
```bash
# Execute as migrations
docker-compose exec app php artisan migrate:fresh
```

### Frontend não conecta ao backend
- Verifique se a URL da API está correta nos services Angular
- Confirme que o CORS está habilitado no backend

## 👨‍💻 Desenvolvedor

**Bruno** - Desenvolvedor Full Stack Senior

## 📄 Licença

Este projeto foi desenvolvido como parte do desafio técnico para a vaga de Desenvolvedor Full Stack na **Bry Tecnologia**.

## 🙏 Agradecimentos

- Bry Tecnologia pela oportunidade
- Laravel & Angular communities
- Docker community
