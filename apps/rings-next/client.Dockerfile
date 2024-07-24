FROM node:18.19.0

ARG env=development
ARG apiUrl=http://localhost:3001
ARG publicUrl=http://localhost:3000

WORKDIR /usr/local/dist/

# cache packages
# https://medium.com/@stepanvrany/how-to-build-nodejs-docker-image-using-cache-c401137661d0
COPY package.json ./
COPY packages/next/package.json ./packages/next/

COPY yarn.lock ./

# install node dependencies
RUN yarn install

COPY packages/next ./packages/next

RUN APP_ENV=${env} NEXT_PUBLIC_URL=${publicUrl} NEXT_PUBLIC_API_URL=${apiUrl} yarn run web:prod