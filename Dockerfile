FROM node:lts-slim
WORKDIR /gitcol-learning
COPY . /gitcol-learning
RUN npm install
RUN npm audit fix
EXPOSE 8443
CMD [ "node","--run", "start" ]