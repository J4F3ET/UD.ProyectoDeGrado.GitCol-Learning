FROM node:lts-slim

WORKDIR /gitcol-learning
COPY package.json ./

RUN npm ci --only=production

COPY build/ ./build
EXPOSE 8443

CMD ["node", "build/server.js"]
