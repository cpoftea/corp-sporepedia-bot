FROM node:14-alpine

WORKDIR /node/app
COPY . .
RUN npm ci
USER node
CMD ["node", "-r", "esm", "start.js"]
