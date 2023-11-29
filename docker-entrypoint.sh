## docker-entrypoint.sh for node.js

echo "Waiting on the DB server"
dockerize -wait tcp://db:3306 -timeout 60s

echo "Starting the Node server"
node app.js