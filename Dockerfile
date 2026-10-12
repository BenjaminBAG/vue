# Usar la imagen oficial de Node.js
FROM node:20-slim AS base
ENV NODE_ENV=production
WORKDIR /src

# Instalar dependencias
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Imagen final para producción
FROM base
COPY --from=build /src/.output /src/.output

# Exponer el puerto que usa Cloud Run (8080 por defecto)
ENV PORT=8080
EXPOSE 8080

CMD [ "node", ".output/server/index.mjs" ]
