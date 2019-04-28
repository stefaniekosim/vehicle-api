FROM node:8

WORKDIR /usr/src/vehicle-api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 14103

CMD [ "npm" , "start" ]