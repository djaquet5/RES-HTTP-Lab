# Loads the docker image for the node.js framework from DockerHub
FROM node:8.11

# Update the package and install vim
RUN apt-get update &&\
    apt-get install -y vim

# Copy the source code of our node.js application in the /opt/app directory
COPY src /opt/app

# Every time we'll run the container, it will execute the following command.
CMD ["node", "/opt/app/index.js"]
