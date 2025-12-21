# Frontend - Sistema de Gerenciamento Bry

## Tecnologias Utilizadas

- **Angular 21**: Framework principal
- **Tailwind CSS 3.4**: Framework CSS para estilização
- **TypeScript**: Linguagem de programação
- **RxJS**: Programação reativa

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── companies/       # CRUD de Empresas
│   │   │   ├── customers/       # CRUD de Clientes
│   │   │   └── employees/       # CRUD de Funcionários
│   │   ├── models/              # Interfaces TypeScript
│   │   ├── services/            # Serviços HTTP
│   │   ├── validators/          # Validadores customizados
│   │   ├── app.html            # Template principal
│   │   ├── app.ts              # Componente principal
│   │   ├── app.routes.ts       # Configuração de rotas
│   │   └── app.config.ts       # Configuração da aplicação
│   ├── environments/           # Variáveis de ambiente
│   └── styles.css             # Estilos globais
├── tailwind.config.js         # Configuração do Tailwind
├── postcss.config.js          # Configuração do PostCSS
└── package.json               # Dependências
```

## Funcionalidades Implementadas

### 1. CRUD de Empresas (Companies)
- ✅ Listagem de empresas
- ✅ Cadastro de novas empresas
- ✅ Edição de empresas existentes
- ✅ Exclusão de empresas
- ✅ Exibição de funcionários e clientes vinculados
- ✅ Validação de campos (nome sem acentuação, CNPJ com 14 dígitos)

### 2. CRUD de Funcionários (Employees)
- ✅ Listagem de funcionários
- ✅ Cadastro de novos funcionários
- ✅ Edição de funcionários existentes
- ✅ Exclusão de funcionários
- ✅ Upload de documentos (PDF ou JPG, máx. 2MB)
- ✅ Validação de campos (login e nome sem acentuação)
- ✅ Validação de CPF (11 dígitos)
- ✅ Validação de email
- ✅ Validação de senha (mínimo 6 caracteres)
- ✅ Exibição de empresas vinculadas

### 3. CRUD de Clientes (Customers)
- ✅ Listagem de clientes
- ✅ Cadastro de novos clientes
- ✅ Edição de clientes existentes
- ✅ Exclusão de clientes
- ✅ Upload de documentos (PDF ou JPG, máx. 2MB)
- ✅ Validação de campos (login e nome sem acentuação)
- ✅ Validação de CPF (11 dígitos)
- ✅ Validação de email
- ✅ Validação de senha (mínimo 6 caracteres)
- ✅ Exibição de empresas vinculadas

### 4. Tratamento de Erros
- ✅ Interceptor HTTP global para captura de erros
- ✅ Tratamento específico para códigos HTTP (400, 401, 403, 404, 422, 500, 503)
- ✅ Exibição de mensagens de erro amigáveis
- ✅ Log detalhado de erros no console para debug
- ✅ Tratamento de erros de validação do Laravel (422)

### 5. Validações Customizadas
- ✅ Validador de acentuação (`noAccentsValidator`)
- ✅ Validação de tamanho de arquivo (máx. 2MB)
- ✅ Validação de tipo de arquivo (apenas PDF e JPG)

### 6. Interface e Navegação
- ✅ Menu de navegação responsivo
- ✅ Rotas configuradas para todos os CRUDs
- ✅ Design responsivo com Tailwind CSS
- ✅ Feedback visual para erros de validação
- ✅ Confirmação antes de exclusões

## Configuração de Ambiente

### Desenvolvimento Local
```typescript
// src/environments/environment.ts
apiUrl: 'http://localhost:8000/api'
```

### Produção (Docker)
```typescript
// src/environments/environment.prod.ts
apiUrl: 'http://backend/api'
```

## Comandos Disponíveis

### Desenvolvimento
```bash
npm start                  # Inicia servidor de desenvolvimento (porta 4200)
npm run build             # Build de produção
npm run watch             # Build com watch mode
npm test                  # Executa testes
```

### Build para Docker
```bash
npm run build             # Gera build otimizado em dist/frontend
```

## Requisitos Atendidos do Desafio

### Questão 2 - Frontend Angular
- ✅ Framework Angular 21 (superior à versão 17 solicitada)
- ✅ CRUD completo de serviços (Empresas, Funcionários e Clientes)
- ✅ Tratamento de erros de forma genérica (preparado para mais serviços)
- ✅ Validação que impede cadastro com acentuação nos campos login e nome
- ✅ Upload de documentos em formato PDF ou JPG
- ✅ Integração completa com a API backend

## Destaques da Implementação

### 1. Arquitetura Modular
- Componentes standalone do Angular 21
- Separação clara de responsabilidades
- Serviços reutilizáveis

### 2. Código Limpo e Comentado
- Comentários explicativos nos métodos
- Código TypeScript tipado
- Seguindo boas práticas do Angular

### 3. Experiência do Usuário
- Feedback imediato de validações
- Mensagens de erro claras e específicas
- Interface intuitiva e responsiva
- Loading states e confirmações

### 4. Segurança
- Validação no frontend e backend
- Não exibe senhas em edições
- Validação de tipos e tamanhos de arquivo

### 5. Preparado para Docker
- Variáveis de ambiente configuradas
- Build otimizado para produção
- Configuração de proxy para API

## Próximos Passos Sugeridos

1. Adicionar testes unitários e e2e
2. Implementar paginação nas listagens
3. Adicionar busca e filtros
4. Melhorar feedback visual (toasts ao invés de alerts)
5. Adicionar loading spinners
6. Implementar lazy loading nas rotas
7. Adicionar internacionalização (i18n)

## Observações

- O projeto está configurado para rodar tanto em desenvolvimento local quanto em Docker
- Todas as validações solicitadas no PDF do desafio foram implementadas
- O código está preparado para fácil expansão e manutenção
- O tratamento de erros é genérico e funcionará para novos serviços adicionados
