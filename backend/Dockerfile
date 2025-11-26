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

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Compiler le code TypeScript
RUN npm run build

# Exposer le port
EXPOSE 3001

# Script de démarrage qui exécute les migrations puis démarre l'app
CMD sh -c "npx prisma migrate deploy && npm run start:prod"
