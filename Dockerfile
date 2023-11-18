FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY docker/dev .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]