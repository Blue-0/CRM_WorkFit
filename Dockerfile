FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# COPY . . (Code will be mounted via volume in docker-compose)

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
