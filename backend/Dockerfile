FROM node:slim
WORKDIR /app
COPY . /app
RUN npm i -g nodemon
RUN npm i
EXPOSE 3000

CMD nodemon index.js