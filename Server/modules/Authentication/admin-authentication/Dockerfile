# from the image you want to use

FROM node:20-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install
COPY . . 

# env variable

ENV PORT=8001
ENV GOOGLE_CLIENT_ID=403554056859-2lrrqd17llo897qpv4tipmf0csrjrals.apps.googleusercontent.com
ENV JWT_SECRET=mysecret
ENV URL=mongodb+srv://timtim:timtim@cluster0.m2dvo.mongodb.net/school

RUN npm run build 
EXPOSE 8001 
CMD ["npm", "start"]

