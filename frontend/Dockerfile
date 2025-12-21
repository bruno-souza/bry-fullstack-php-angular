# Stage 1: Build da aplicação Angular
FROM node:20-alpine AS build

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm ci

# Copia o código fonte
COPY . .

# Build da aplicação em modo produção
RUN npm run build -- --configuration production

# Stage 2: Servir com Nginx
FROM nginx:alpine

# Remove a configuração padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos buildados do stage anterior
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copia configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
