#!/bin/bash

if [ $# -ge 1 ] && [ $1 == '--restart' ]; then
    CONTAINER_ID=$(docker ps -aqf "name=twidr-postgres");
    if [ ${#CONTAINER_ID} -ge 0 ]; then
        echo "Killing postgres container ${CONTAINER_ID}"
        {
            docker stop $CONTAINER_ID;
            docker rm $CONTAINER_ID;   
        } &> /dev/null
    fi
fi

docker ps -a | grep postgres &> /dev/null
if [ $? -ne 0 ]; then
    echo "Starting postgres";
    docker pull postgres;
    docker run --name twidr-postgres -e POSTGRES_PASSWORD=admin -p 5432:5432 -d postgres;
fi

