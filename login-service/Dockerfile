FROM node:16-alpine AS builder
WORKDIR /app
COPY /login-service/package*.json ./
RUN npm install
COPY /login-service/ .
RUN npm run build

FROM node:16-alpine AS server
WORKDIR /app
COPY /login-service/package* ./
RUN npm install --production
COPY --from=builder ./app/dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
