#!/bin/sh

echo "⏳ Aguardando MySQL ficar disponível..."

while ! nc -z db 3306; do
  sleep 2
done

echo "✅ MySQL disponível!"

echo "🚀 Rodando migrations..."
php artisan migrate --force || true

echo "🚀 Iniciando Apache..."
exec apache2-foreground
