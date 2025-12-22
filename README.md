# Sistema de Gerenciamento Bry - Fullstack PHP/Angular

Sistema completo de gerenciamento de Empresas, Funcionários e Clientes com autenticação de usuários, desenvolvido com Laravel (backend) e Angular (frontend).

## 📋 Descrição do Projeto

Aplicação fullstack com API REST e interface web para gerenciar empresas, funcionários e clientes, incluindo:
- Sistema de autenticação e autorização de usuários
- CRUD completo de Empresas, Funcionários e Clientes
- Relacionamentos many-to-many entre entidades
- Paginação e filtros de pesquisa
- Validações robustas e tratamento de erros
- Interface responsiva e intuitiva
- Documentação automática da API com Scramble
- Containerização completa com Docker

## 🚀 Tecnologias Utilizadas

### Backend
- **PHP 8.4** - Linguagem
- **Laravel 11** - Framework PHP
- **MySQL 8.0** - Banco de dados
- **Apache** - Servidor web
- **Scramble** - Documentação automática OpenAPI

### Frontend
- **Angular 19** - Framework JavaScript
- **TypeScript** - Linguagem
- **TailwindCSS** - Framework CSS
- **RxJS** - Programação reativa
- **Nginx** - Servidor web

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

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

## 📋 Pré-requisitos

Antes de executar a aplicação, certifique-se de ter instalado:

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)

### Verificar Instalação

```bash
# Verificar versão do Docker
docker --version

# Verificar versão do Docker Compose
docker-compose --version
```

## 🚀 Como Executar a Aplicação

### Passo 1: Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd bry-fullstack-php-angular
```

### Passo 2: Subir os Containers

Na raiz do projeto, execute:

```bash
docker-compose up -d --build
```

Este comando irá:
1. Fazer o build das imagens Docker do backend e frontend
2. Criar e iniciar os containers:
   - `bry_database` - MySQL 8.0
   - `bry_backend` - Laravel API
   - `bry_frontend` - Angular App
3. Configurar a rede entre os containers

### Passo 3: Aguardar Inicialização

Aguarde aproximadamente **30-60 segundos** para os containers iniciarem completamente.

O script de inicialização automática (`entrypoint.sh`) irá:
- ✅ Copiar o arquivo `.env.example` para `.env` (se não existir)
- ✅ Gerar a chave da aplicação Laravel (`APP_KEY`)
- ✅ Aguardar o MySQL ficar disponível
- ✅ Executar as migrations do banco de dados automaticamente
- ✅ Iniciar o servidor Apache

### Passo 4: Acessar a Aplicação

Após a inicialização, acesse:

- **Frontend (Aplicação Web)**: http://localhost:4200
- **Backend (API REST)**: http://localhost:8000/api
- **Documentação da API**: http://localhost:8000/docs/api
- **Banco de Dados MySQL**: localhost:3306

**Credenciais do MySQL:**
- Host: `localhost`
- Porta: `3306`
- Database: `laravel`
- Usuário: `laravel`
- Senha: `laravel`

## 📝 Primeiro Acesso

1. Acesse http://localhost:4200
2. Clique em "Registre-se" para criar sua conta
3. Preencha os dados do formulário de registro
4. Após o registro, você será automaticamente logado
5. Comece a gerenciar Empresas, Funcionários e Clientes

## 🔧 Comandos Úteis

### Gerenciar Containers

```bash
# Ver status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um container específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# Parar os containers (mantém os dados)
docker-compose stop

# Iniciar containers parados
docker-compose start

# Parar e remover containers (CUIDADO: remove dados do banco)
docker-compose down

# Parar e remover containers + volumes (limpa tudo)
docker-compose down -v

# Rebuild completo (sem cache)
docker-compose build --no-cache
docker-compose up -d
```

### Comandos do Backend (Laravel)

```bash
# Acessar o container do backend
docker-compose exec backend bash

# Executar migrations
docker-compose exec backend php artisan migrate

# Resetar banco de dados (CUIDADO: apaga todos os dados)
docker-compose exec backend php artisan migrate:fresh

# Ver rotas da API
docker-compose exec backend php artisan route:list

# Limpar caches
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear

# Executar tinker (console interativo)
docker-compose exec backend php artisan tinker
```

### Comandos do Frontend (Angular)

```bash
# Acessar o container do frontend
docker-compose exec frontend sh

# Build de produção
docker-compose exec frontend npm run build

# Ver logs do servidor Nginx
docker-compose exec frontend tail -f /var/log/nginx/access.log
docker-compose exec frontend tail -f /var/log/nginx/error.log
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

## 🐛 Resolução de Problemas

### Porta já em uso

Se você receber erro informando que uma porta já está em uso:

```bash
# Verificar processo usando a porta 8000 (backend)
sudo lsof -i :8000

# Verificar processo usando a porta 4200 (frontend)
sudo lsof -i :4200

# Verificar processo usando a porta 3306 (MySQL)
sudo lsof -i :3306

# Matar processo (substitua PID pelo número do processo)
kill -9 PID
```

### Erro: "Connection refused" ao acessar API

```bash
# Verificar se os containers estão rodando
docker-compose ps

# Ver logs do backend para identificar o erro
docker-compose logs backend

# Reiniciar os containers
docker-compose restart
```

### Erro: "Table doesn't exist"

```bash
# Executar as migrations novamente
docker-compose exec backend php artisan migrate

# Ou resetar o banco completamente
docker-compose exec backend php artisan migrate:fresh
```

### Frontend não carrega ou exibe tela branca

```bash
# Verificar logs do frontend
docker-compose logs frontend

# Reconstruir o frontend
docker-compose up -d --build frontend

# Verificar se o Nginx está funcionando
docker-compose exec frontend nginx -t
```

### MySQL não inicializa

```bash
# Remover volumes e recriar
docker-compose down -v
docker-compose up -d

# Verificar logs do MySQL
docker-compose logs database
```

### Permissões negadas no Laravel

```bash
# Acessar o container
docker-compose exec backend bash

# Ajustar permissões
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Limpar tudo e recomeçar

```bash
# Para tudo e remove volumes
docker-compose down -v

# Remove imagens antigas
docker-compose rm -f

# Rebuild completo
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Funcionalidades da Aplicação

### Autenticação
- ✅ Registro de novos usuários
- ✅ Login com validação
- ✅ Logout
- ✅ Proteção de rotas (Guards)
- ✅ Sessão persistente com localStorage

### Empresas
- ✅ Listar empresas com paginação
- ✅ Criar nova empresa
- ✅ Editar empresa existente
- ✅ Excluir empresa
- ✅ Vincular funcionários e clientes

### Funcionários
- ✅ Listar funcionários com paginação
- ✅ Criar novo funcionário
- ✅ Editar funcionário existente
- ✅ Excluir funcionário
- ✅ Vincular a empresas

### Clientes
- ✅ Listar clientes com paginação
- ✅ Criar novo cliente
- ✅ Editar cliente existente
- ✅ Excluir cliente
- ✅ Vincular a empresas

### Interface
- ✅ Design responsivo com TailwindCSS
- ✅ Navegação intuitiva
- ✅ Feedback visual de erros
- ✅ Validações em tempo real
- ✅ Confirmações antes de exclusões
- ✅ Botão voltar em todos os formulários

## 👨‍💻 Desenvolvedor

**Bruno** - Desenvolvedor Fullstack

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de demonstração de habilidades técnicas.
