FROM node:18-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache bash

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ENV CHOKIDAR_USEPOLLING=true

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
