FROM node:alpine

WORKDIR /usr/node_express

COPY package*.json .

RUN npm install\
  && npm install typescript -g

COPY . .
RUN yarn build

CMD ["node", "./build/server.js"]
