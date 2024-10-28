# RS School: Websocket battleship server
[Task](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/battleship/assignment.md)

## Technical requirements
- Use 22.9.0 LTS version of Node.js
- Use TypeScript


## Start
1. Clone the project from repository
```bash
git clone git@github.com:maria-akulova/websocket.git
```

2. Check current version of node
```bash
node -v
```

If node is not according to technical requirements, apply correct version
```bash
nvm use 22.9.0
```
3. Install dependencies
```bash
npm i
```
4. Rename .env.example 
```bash
# If you are using unix/linux terminal
mv .env.example .env
```


### Scripts to run
#### Build an application using webpack
```bash
# Build mode
npm run build
```
### Run Application

You can run application in 2 modes:
- Dev
- Prod


Use Dev  mode if you want to investigate, debug the app.

Use Prod  mode if you want to run app as it will be in real condition on the production.


```bash
# Development mode
npm run start:dev
# App UI is running at `http://localhost:8181`
```

```bash
# Production mode
$ npm run start
# App UI is running at `http://localhost:8181`

```
## Style

```bash
# check the code using ESLint
npm run lint
```

```bash
# format files using Prettier
$ npm run format

```

## Usage

App started as UI + backend. Each part is running on different ports. 
To test websocket, you can open Postman : localhost:3000
To test game, you can open browser : localhost:8181.

Information about servers and ports are in console.
After the program stops, each WebSocket connection will be closed.

Users are added to the database during login which is a registration process as well and removed when their WebSocket connection is closed. You could not create user with already exist name.


**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.
