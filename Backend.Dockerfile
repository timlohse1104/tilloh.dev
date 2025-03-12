FROM node:alpine

WORKDIR /app

COPY backend/dist/apps/tilloh-dev /app
COPY backend/package.json /app
COPY backend/package-lock.json /app
COPY backend/apps/tilloh-dev/.env /app

RUN npm ci

EXPOSE 61154

CMD ["node", "main.js"]