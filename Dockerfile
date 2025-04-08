FROM node:22-alpine

ENV NODE_ENV production

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=optional

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "run", "start"]