FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./
COPY public ./public

ENV PORT=5178
EXPOSE 5178

CMD ["node", "server.js"]
