# dev
# FROM node:20-alpine
# WORKDIR /tg-frontend
# COPY ./package.json .
# COPY . .
# RUN npm install
# EXPOSE 80
# CMD [ "npm", "run", "dev"]


# # prod
# FROM node:20-alpine
# WORKDIR /tg-frontend
# COPY . .
# RUN npm install
# RUN npm run build
# EXPOSE 80
# CMD [ "npm", "run", "start"]

FROM node:18-alpine as builder
WORKDIR /tg-frontend
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /tg-frontend

COPY --from=builder /tg-frontend ./
COPY --from=builder /tg-frontend/build ./public
COPY --from=builder /tg-frontend/package*.json ./
COPY --from=builder /tg-frontend/node_modules ./node_modules

EXPOSE 80

CMD [ "npm", "run", "dev"]