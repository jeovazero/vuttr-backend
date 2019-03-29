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

Access this link [Reference](https://vuttr-api.surge.sh)

## Scripts

#### `yarn install`
> Install the dependencies

#### `yarn start`
> Starts the server in production mode (localhost:3000)

#### `yarn dev`
> Starts the server in development mode (localhost:3000)

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

## Example of usage with curl

1. Build

    `docker-compose build`

2. Run

    `docker-compose up`

3. Register user

    ```sh
    curl \
        -X POST \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"joao@mail.com\",\"name\":\"joao\",\"password\":\"huehuebr\"}" \
        http://localhost:3000/api/v1/auth/register
    ```

4. Login

    ```sh
    curl \
        -X POST \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"joao@mail.com\",\"password\":\"huehuebr\"}" \
        http://localhost:3000/api/v1/auth
    ```

5. Add tool, passing the returned token of previous step
    ```sh
    curl \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvYW9AbWFpbC5jb20iLCJpYXQiOjE1NTM3MTEyMzIsImV4cCI6MTU1MzcxMjEzMiwianRpIjoiNWM5YmJlYWI3NDY4NDMwMDEwNzU4OWZkOjE1NTM3MTEyMzI4MTI6THFLc3NtZlo1ZzZuWjIxOFljS3ZYIn0.gUCtWfi1o-cajt5g9Koa4m7joW070j7AzIoPfSzbEqI" \
        -d "{\"description\":\"desc tool 1\",\"title\":\"tool1\",\"tags\":[\"tag1\"],\"link\":\"https://tool1.com\"}" \
        http://localhost:3000/api/v1/tools
    ```
6. Get all tools

    ```sh
    curl \
        -X GET \
        -H "Content-Type: application/json" \
        -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvYW9AbWFpbC5jb20iLCJpYXQiOjE1NTM3MTI5MTMsImV4cCI6MTU1MzcxMzgxMywianRpIjoiNWM5YmJlYWI3NDY4NDMwMDEwNzU4OWZkOjE1NTM3MTI5MTM0NzM6UGt2ZXc3c2NWOUNjaWluYmZCZlV2In0.VgIpdBbsPqy9chw8X7TiJTEKxj_GYn2irbpUTuKkQfE" \
        http://localhost:3000/api/v1/tools
    ```


##

by <a href="https://github.com/jeovazero">@jeovazero</a>
