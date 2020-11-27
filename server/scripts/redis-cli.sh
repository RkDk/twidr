#!/bin/bash

CONTAINER_ID=$(docker ps -aqf "name=twidr-redis");
if [ ${#CONTAINER_ID} -gt 0 ]; then
    docker run -it --rm --name redis-cli --network container:twidr-redis redislabs/rejson:latest redis-cli;
else
    echo "twidr-redis is not running";
fi


