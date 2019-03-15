# VUTTR Backend
A API to VUTTR (Very Useful Tools to Remember) application


## Scripts

#### `yarn install`
> Install the dependencies

#### `yarn start`
> Starts the server in production mode

#### `yarn dev`
> Starts the server in development mode

#### `yarn prettier`
> Formats the code

#### `yarn lint`
> Checks code conforms to linting rules (standard)

#### `yarn lint:fix`
> Checks and fixes code conforms to linting rules (standard)

#### `yarn test`
> Runs the tests

#### `yarn test:watch`
> Runs the tests in watch mode

## Docker

### Using only docker
#### Building
```sh
$ sh scripts/docker-build.sh
```

#### Running
```sh
$ sh scripts/docker-run.sh
```

#### Complete script

```sh
# build
docker build -t vuttr:api .

# create a network
docker network create -d bridge vuttr-network

# Run mongo in network vuttr
docker run -d \
    --network "vuttr-network" \
    --rm=true \
    --name "mongo_host" \
    mongo

# Run vuttr:api in network vuttr
docker run -d \
    --network "vuttr-network" \
    --rm=true \
    -e MONGO_URI=mongodb://mongo_host:27017/vuttr-api \
    -p 3000:3000 \
    --name "vuttr_api" \
    vuttr:api

```

### Using docker-compose
```
docker-compose up
```

## 

by @jeovazero
