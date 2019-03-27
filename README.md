# VUTTR Backend
A API to **VUTTR** (Very Useful Tools to Remember) application

## General

- Framework: koajs2
- Database: Mongodb
- Database Schemas: Mongoose
- Validation Schemas: Joi
- Test: Jest
- Formatter: prettier-standard
- Linter: Standard
- Git hooks: husky

## Authentication and Password Hash

Utilized **JSON Web Token** for tokens, **Redis** for user keys management and **Argon2** to password hash

## API Reference

For API documentation was used the **API Blueprint** format then generated the html of reference with **Aglio**

Access thi link [Reference](https://htmlpreview.github.io/?https://github.com/jeovazero/vuttr-backend/blob/master/docs/index.html)

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

### Using docker-compose

#### Building

```
docker-compose build
```

#### Running

```
docker-compose up
```

##

by <a href="https://github.com/jeovazero">@jeovazero</a>
