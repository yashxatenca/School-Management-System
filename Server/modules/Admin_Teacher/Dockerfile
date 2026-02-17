FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# 👇 ENV Variables
ENV PORT=8002
ENV URL=mongodb+srv://timtim:timtim@cluster0.m2dvo.mongodb.net/school
ENV JWT_SECRET=mysecret

EXPOSE 8002

CMD ["node", "dist/index.js"]

