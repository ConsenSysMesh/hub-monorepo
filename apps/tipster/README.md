# Tipster

## 🔦 About

This monorepo contains the code necessary to run tipster

## 📦 Included packages

- [Tamagui](https://tamagui.dev) 🪄
- Next.js
- Express

## 💻 System Requirements

For [canvas](https://github.com/Automattic/node-canvas?tab=readme-ov-file#compiling), make sure to install its dependencies for Mac OS:

```
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

In some cases you might need to additionally install `brew install python-setuptools`.

## 🗂 Folder layout

The main apps are:

- `next` (web)
- `express` (server)
- `config` includes all the configuration for the stack

## 🏁 Start the app

- Install dependencies: `yarn`

- Start PM2: `yarn start` (loads web and server)
- Stop PM2: `yarn stop`


To run with optimizer on in dev mode (just for testing, it's faster to leave it off): `yarn web:extract`. To build for production `yarn web:prod`.

To see debug output to verify the compiler, add `// debug` as a comment to the top of any file.

## Update new dependencies

```sh
yarn upgrade-interactive
```

### Deploying to Vercel

- Root: `apps/next`
- Install command to be `yarn set version stable && yarn install`
- Build command: leave default setting
- Output dir: leave default setting

### Deploying on our Hosted env
- Connect to our prod instance: `yarn connect-production` then run `home` to login as ec2-user 
- Pull latest source (make sure you're on the right branch)
- Build new docker containers: `yarn docker-build-production`
- Up the new containers: `yarn docker-up-production`
