FROM node:lts-alpine

RUN npm instal -g pnpm

COPY package.json .

COPY pnpm-lock.yaml .

RUN pnpm i

COPY . .
