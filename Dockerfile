FROM node:alpine

EXPOSE 3000
 
WORKDIR /app
 
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .
 
CMD [ "node", "src/api.js" ]
