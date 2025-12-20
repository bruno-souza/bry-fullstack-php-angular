# Desafio Full Stack PHP / Angular

Este projeto foi desenvolvido como parte de um desafio técnico para a vaga de Programador Full Stack PHP (PL/SR), utilizando Laravel no backend e Angular no frontend (a ser integrado).

## 🧱 Arquitetura Geral

O backend foi containerizado utilizando Docker, seguindo boas práticas de arquitetura e aproximando o ambiente de desenvolvimento do ambiente de produção.

### Stack Backend

- PHP 8.4
- Laravel (versão atual)
- Apache
- MySQL 8
- Docker / Docker Compose

---

## 🐳 Decisão Arquitetural: Código fora de volumes

Uma decisão importante neste projeto foi **não montar o código da aplicação como volume Docker**.

### ❌ O que NÃO foi feito

```yaml
volumes:
  - .:/var/www/html


## 🗄️ Inicialização do banco de dados

As migrations do Laravel são executadas automaticamente na inicialização do container do backend.

Isso garante que:
- O banco de dados esteja sempre preparado
- Nenhuma ação manual seja necessária após subir o ambiente
- O projeto funcione corretamente em um banco vazio

Essa abordagem torna o ambiente totalmente reproduzível.


#Comandos para derrubar o docker, gerar nova imagem e depois subir: (rodar dentro da pasta do projeto)
docker compose down
docker compose build --no-cache
docker compose up
