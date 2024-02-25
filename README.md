# marist-faculty-elections
A system for Faculty Awards Elections at Marist College

# Dependencies
 - Node.js
 - Docker

## Installing Node.js
Download Node.js from https://nodejs.org/en/download
Add to PATH
Once installed, go to the root of the git repository and run `npm install`
All node modules used by the app will be downloaded and installed to the local repo

## Installing Docker
For installation instructions for Docker, refer to these Docker guides:
 - https://docs.docker.com/desktop/install/windows-install/
 - https://docs.docker.com/engine/install/ubuntu/
 - https://docs.docker.com/desktop/install/mac-install/

In the root of the repo, run `docker compose build` to build the Docker image from the compose.yaml file


# Running the application locally
To run the application on a local dev machine, follow these instructions:
 - run `npm install` to ensure modules are up to date
 - run `docker compose up --build` to build and run the server and its dependencies. -d can also be added to run the whole application in detached mode (output from each container is not printed to console)
 - the MySQL database setup in misc/facultytables.sql can be used to initalize a local database for testing

# Running the application on the VM for testing and deployment
To run the application on the remote VM, follow these instructions:
 - go to the root of the repository and ensure that you are on the main branch of the repo with `git checkout main`
 - pull any changes from the remote repository with `git pull`
 - run 'docker compose build' to build the Docker image with any changes
 - if not already running, get the MySQL database running with `docker compose up db adminer -d`
   - this will run the DB (and adminer) in detached mode, as these two should not have to be shut down
 - run the server with this command: `docker compose run -p 443:3000 server`

 Running the server this way allows the server to be shut down, rebuilt, and then restarted without affecting the DB