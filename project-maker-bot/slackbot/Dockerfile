FROM alpine

RUN apk add vim curl nodejs npm

WORKDIR /app/slackbot
COPY . .

RUN npm install
CMD ["node","bot.js"]