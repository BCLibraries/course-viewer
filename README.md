## Installing

You'll need [node](https://nodejs.org/en/download/) and [yarn](https://classic.yarnpkg.com/en/) installed to work on reserves.

Install the server and client applications on your machine:

```shell script
cd server
yarn install
cd ../client
yarn install
```

## The development environment

The server and client development environments are launched using a yarn command:

```shell script
cd client
yarn dev
```

## Deployment

### Client

Build the client using `yarn` and upload the contents of the _build_ directory to the production server.

```shell script
cd client
yarn build
```