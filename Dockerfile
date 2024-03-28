FROM node:20

WORKDIR /ims

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]