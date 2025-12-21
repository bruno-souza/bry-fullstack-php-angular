#!/bin/sh

# Cria .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
fi

# Gera chave da aplicação se não existir
if ! grep -q "APP_KEY=base64:" .env; then
    echo "🔑 Gerando chave da aplicação..."
    php artisan key:generate --force
fi

echo "⏳ Aguardando MySQL ficar disponível..."

while ! nc -z db 3306; do
  sleep 2
done

echo "✅ MySQL disponível!"

echo "🚀 Rodando migrations..."
php artisan migrate --force || true

echo "🌱 Rodando seeders..."
php artisan db:seed --force || true

echo "🚀 Iniciando Apache..."
exec apache2-foreground
