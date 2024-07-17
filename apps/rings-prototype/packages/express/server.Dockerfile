FROM node:18.19.0

# need these depends to build the `canvas` package. Also had to switch away from the alpine image version
RUN apt-get update
RUN apt-get -y install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

WORKDIR /usr/local/dist/

# cache packages
# https://medium.com/@stepanvrany/how-to-build-nodejs-docker-image-using-cache-c401137661d0
COPY package.json ./
COPY packages/express/package.json ./packages/express/

COPY yarn.lock ./

# install node dependencies
RUN yarn install

# copy files
COPY packages/config ./packages/config
#COPY scripts ./scripts
COPY packages/express ./packages/express

# nothing to build for a backend node app