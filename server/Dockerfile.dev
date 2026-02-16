FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# COPY . . (Code will be mounted via volume in docker-compose)

EXPOSE 3001

CMD ["npm", "run", "dev"]
