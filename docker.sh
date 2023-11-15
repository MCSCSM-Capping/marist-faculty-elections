#!/bin/bash
docker compose create --build

docker tag marist-faculty-elections-server nicfio25/marist-faculty-elections-server:dev

docker push nicfio25/marist-faculty-elections-server:dev