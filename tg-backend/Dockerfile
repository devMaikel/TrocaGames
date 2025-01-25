# FROM node:16.14-alpine
# WORKDIR /tg-backend
# COPY . .
# RUN npm install
# EXPOSE 3000
# # CMD ["sh", "-c", "npm run migration:run && npm run seed:drivers && npm run start"]
# CMD ["sh", "-c", "npm run migration:run && npm run seed:drivers && npm run start:dev"]

# # CMD ["npm", "run", "start:dev"]


FROM node:22
WORKDIR /app

# Copia os arquivos de definição de dependências
# COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

COPY . .
RUN npm install --include=dev

RUN npm install -g prisma
RUN npm install -g @nestjs/cli

# Copia o schema do Prisma e os arquivos de migração
COPY prisma/schema.prisma ./prisma/
COPY prisma/migrations ./prisma/migrations

# Gera o cliente do Prisma
RUN npx prisma generate

# Expõe a porta do aplicativo
EXPOSE 3000

# Comando para rodar as migrations e iniciar o aplicativo em desenvolvimento
CMD npx prisma migrate deploy && npm run start:dev