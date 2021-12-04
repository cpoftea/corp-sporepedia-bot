FROM node:16-alpine

WORKDIR /node/app
COPY . .
RUN npm ci
USER node
CMD ["node", "start.mjs"]
