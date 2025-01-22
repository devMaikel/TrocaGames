FROM node:16.14-alpine
WORKDIR /tg-backend
COPY . .
RUN npm install
EXPOSE 3000
# CMD ["sh", "-c", "npm run migration:run && npm run seed:drivers && npm run start"]
CMD ["npm", "run", "start:dev"]
