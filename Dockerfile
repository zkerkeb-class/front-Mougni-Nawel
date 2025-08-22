FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN ls -la /app

RUN npm i

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
