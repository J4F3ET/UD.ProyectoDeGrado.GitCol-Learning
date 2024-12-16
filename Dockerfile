FROM node:lts-alpine
WORKDIR /app
COPY . /app
RUN npm install
RUN npm audit fix
EXPOSE 8080
CMD [ "node","--run", "start" ]