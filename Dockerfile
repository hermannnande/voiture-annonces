# Dockerfile pour Railway - Build depuis la racine
FROM node:20-alpine

WORKDIR /app

# Installer les dépendances système
RUN apk add --no-cache python3 make g++ openssl openssl-dev

# Copier les fichiers de dépendances depuis backend/
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Installer les dépendances
RUN npm ci --only=production && npm install -D @nestjs/cli prisma

# Copier tout le code backend
COPY backend/ ./

# Générer le client Prisma
RUN npx prisma generate

# Compiler le code TypeScript
RUN npm run build

# Nettoyer
RUN rm -rf src/ test/ node_modules/@types

# Exposer le port
EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Commande de démarrage
CMD npx prisma generate && npx prisma db push --accept-data-loss && node dist/src/main.js
