# Dockerfile para Nuxt 3
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Instalar dependencias necesarias para build
RUN apk add --no-cache git python3 make g++

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias usando legacy-peer-deps (según configuración del proyecto)
RUN npm install --legacy-peer-deps

# Copiar el resto del código fuente
COPY . .

# Configurar URL de proxy interno para Docker antes de compilar
ENV API_PROXY_URL=http://api-gateway:8080/api

# Compilar el proyecto Nuxt
RUN npm run build

# Exponer el puerto por defecto de Nuxt
EXPOSE 3000

# Variables de entorno para Nuxt en producción
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV NODE_ENV=production

# Ejecutar la aplicación (Nuxt 3 crea el output en .output/server/index.mjs)
CMD ["node", ".output/server/index.mjs"]
