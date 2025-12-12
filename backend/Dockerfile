FROM node:20-alpine

WORKDIR /app

# Installer les dépendances système pour sharp, Prisma et OpenSSL
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl \
    openssl-dev

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances (production uniquement)
RUN npm ci --only=production && npm install -D @nestjs/cli prisma

# Copier le reste du code
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Compiler le code TypeScript
RUN npm run build

# Nettoyer les fichiers inutiles
RUN rm -rf src/ test/ node_modules/@types

# Exposer le port
EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Commande de démarrage avec migrations
CMD npx prisma migrate deploy && node dist/src/main.js
