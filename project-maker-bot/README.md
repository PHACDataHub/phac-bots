This directory holds the code for a GCP project builder bot. This is still work in progress. For now, the code starts up a NodeJS server which listens for POST requests containing a payload(sample shown below) and automates the creation of project yaml files within a Github repo. Docker will be needed for this project.

Payload Sample :
```
{
  "project-dept": "ph",
  "project-env": "test",
  "project-vanity-name": "name",
  "project-classification": "classification",
  "members": [
    "sid",
    "rick",
    "morty"
  ],
  "newProject": true
}
```

To build the docker image :
```
docker build -t NAME-OF-YOUR-BOT .
```

To run a container of the image :
```
docker run --mount source=/var/run/docker.sock,target=/var/run/docker-host.sock,type=bind -p 3000:3000 --rm NAME-OF-YOUR-BOT
```

### TODO :
- Add support for adding project members with different roles
- Add support for editing/deleting a project
- Add Slack Integration
- Add checks to validate user/project existence