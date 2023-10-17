This directory holds the code for a GCP project builder bot.

To build the docker image :
```
docker build -t NAME-OF-YOUR-BOT .
```

To run a container of the image :
```
docker run --mount source=/var/run/docker.sock,target=/var/run/docker-host.sock,type=bind -p 3000:3000 --rm NAME-OF-YOUR-BOT
```