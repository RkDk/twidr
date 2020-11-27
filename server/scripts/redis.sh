#!/bin/bash

if [ $# -ge 1 ] && [ $1 == '--restart' ]; then
    CONTAINER_ID=$(docker ps -aqf "name=twidr-redis");
    if [ ${#CONTAINER_ID} -gt 0 ]; then
        echo "Killing redis container ${CONTAINER_ID}"
        {
            docker stop $CONTAINER_ID;
            docker rm $CONTAINER_ID;   
        } &> /dev/null
    else
        echo "Existing container not found - ignoring";
    fi
fi

docker ps -a | grep redis &> /dev/null
if [ $? -ne 0 ]; then
    echo "Starting redis";
    docker pull redis;
    docker run --name twidr-redis -d redis;
fi

