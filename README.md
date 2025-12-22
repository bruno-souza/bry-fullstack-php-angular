# Bry Fullstack - Sistema de Gerenciamento

Sistema completo de gerenciamento de Empresas, Funcionários e Clientes desenvolvido com Laravel (backend) e Angular (frontend).

## Tecnologias

- **Backend:** PHP 8.2+ + Laravel 12 + MySQL 8.0
- **Frontend:** Angular 21 + TypeScript + TailwindCSS
- **DevOps:** Docker + Docker Compose

## Como Executar

### Pré-requisitos

- Docker (versão 20.10+)
- Docker Compose (versão 2.0+)

### Passo 1: Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd bry-fullstack-php-angular
```

### Passo 2: Subir os Containers

```bash
docker-compose up -d --build
```

> **Nota:** O comando `--build` faz o build automático das imagens Docker. Não é necessário criar as imagens manualmente.

### Passo 3: Aguardar Inicialização

Aguarde aproximadamente 30-60 segundos para os containers iniciarem completamente. O sistema irá automaticamente:
- Configurar o ambiente Laravel
- Executar as migrations do banco de dados
- Popular o banco com dados iniciais

## URLs de Acesso

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:4200 | Aplicação web Angular |
| **Backend API** | http://localhost:8000/api | API REST Laravel |
| **Documentação API** | http://localhost:8000/docs/api | Documentação interativa (Scramble) |
| **phpMyAdmin** | http://localhost:8080 | Interface de gerenciamento do MySQL |

### Credenciais do Banco de Dados

- **Host:** localhost
- **Porta:** 3306
- **Database:** laravel
- **Usuário:** laravel
- **Senha:** laravel

### Credenciais phpMyAdmin

- **Servidor:** db
- **Usuário:** laravel
- **Senha:** laravel

## Primeiro Acesso

1. Acesse http://localhost:4200
2. Clique em "Registre-se" para criar sua conta
3. Preencha os dados e faça login
4. Comece a usar o sistema

Ou use as credenciais de teste pré-cadastradas:
- **Login:** bry
- **Senha:** 123456

## Comandos Úteis

```bash
# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Reiniciar
docker-compose restart
```

## Funcionalidades

- Sistema de autenticação (login/registro)
- CRUD completo de Empresas
- CRUD completo de Funcionários
- CRUD completo de Clientes
- Relacionamentos many-to-many entre entidades
- Paginação e filtros
- Upload de documentos
- Interface responsiva
- Validações robustas
- Documentação automática da API

## Estrutura do Projeto

```
bry-fullstack-php-angular/
├── backend/              # API Laravel
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── Dockerfile
├── frontend/             # Aplicação Angular
│   ├── src/
│   └── Dockerfile
└── docker-compose.yml
```

## Contato

**Bruno Souza**
- Email: bruno.ocelot@gmail.com