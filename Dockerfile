# syntax=docker/dockerfile:1

FROM node:16 as base

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install
COPY . .

FROM base as production
ENV NODE_ENV=production
RUN yarn build
CMD ["yarn", "start"]