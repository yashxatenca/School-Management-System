FROM node: 20-apline

WORKDIR /src

COPY package*.json ./


RUN npm install

COPY . .


RUN npm run build 


EXPOSE 8001 


CMD ["npm", "start"]
