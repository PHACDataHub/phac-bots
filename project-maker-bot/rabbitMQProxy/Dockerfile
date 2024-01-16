FROM alpine

RUN apk add vim curl nodejs npm

WORKDIR /app/rabbitmq-proxy
COPY . .

RUN npm install
CMD ["node","worker.js"]