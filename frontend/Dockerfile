FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos y construir la app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

# Usar Nginx para servir el frontend
FROM nginx:alpine

# Copiar los archivos generados en la fase de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
