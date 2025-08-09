FROM node:lts-slim

WORKDIR /gitcol-learning
COPY package*.json ./

RUN npm i --omit=dev

COPY build/ ./build
COPY docs/ ./docs
EXPOSE 8443

CMD ["node", "build/server.js"]
