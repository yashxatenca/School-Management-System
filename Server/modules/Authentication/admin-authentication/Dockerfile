# from the image you want to use

FROM node:20-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install
COPY . . 
RUN npm run build 
EXPOSE 8001 
CMD ["npm", "start"]

