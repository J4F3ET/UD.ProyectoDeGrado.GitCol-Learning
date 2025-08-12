FROM node:lts-alpine

WORKDIR /gitcol-learning
COPY package*.json ./

RUN npm i --omit=dev

COPY build/ ./build

EXPOSE 8443

CMD ["node", "build/server.js"]
