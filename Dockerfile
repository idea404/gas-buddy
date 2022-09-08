FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "npm", "start" ]