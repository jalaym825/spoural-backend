ARG NODE_VERSION=20.12.2
FROM node:${NODE_VERSION}-alpine as base

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run prisma
RUN npm run build