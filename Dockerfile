FROM node:lts
WORKDIR /gitcol-learning
COPY . /gitcol-learning
RUN npm install
RUN npm audit fix
EXPOSE 8080
CMD [ "node","--run", "start" ]