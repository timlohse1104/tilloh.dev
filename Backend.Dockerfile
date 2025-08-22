FROM node:alpine

WORKDIR /app

COPY backend/dist/apps/tilloh-dev /app
COPY backend/package.json /app
COPY backend/package-lock.json /app

RUN npm ci

EXPOSE 61154

CMD ["node", "main.js"]