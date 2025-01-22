# dev
FROM node:20-alpine
WORKDIR /tg-frontend
COPY ./package.json .
COPY . .
RUN npm install
EXPOSE 80
CMD [ "npm", "run", "dev"]


# # prod
# FROM node:20-alpine
# WORKDIR /tg-frontend
# COPY . .
# RUN npm install
# RUN npm run build
# EXPOSE 80
# CMD [ "npm", "run", "start"]
