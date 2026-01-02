FROM node:18-alpine

WORKDIR /usr/src/app

# Install tools
RUN apk add --no-cache bash

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

CMD ["./docker-entrypoint.sh"]
