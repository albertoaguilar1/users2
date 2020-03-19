FROM node:users2
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
RUN npm i -s nodemon
COPY . /usr/src/app
ENV PORT=8080
EXPOSE 8080
CMD [ "npm", "start" ]