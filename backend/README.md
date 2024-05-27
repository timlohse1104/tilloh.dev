# Backend

## Components

### Memorandum API

The API that powers tilloh.dev Memorandum. Consists of generated identifiers for user sessions and a key-value store to store link information.

### (future) Chat API

The API that powers tilloh.dev Chat.

### (future) Todo API

The API that powers tilloh.dev Todo list.

## API documentation

The API documentation is available at `https://api.tilloh.dev/v1`

## Requirements

### Environment variables

Create a `.env` file in the root of the backend folder with the following variables:

- `PORT`: The port the server will listen to
- `MONGODB_URI`: The URI of the mongodb database
- `GLOBAL_PREFIX`: The prefix for all the routes

## Development server

1. Start mongodb

```
npm run start:db
```

2. Start the backend

```
npm run dev
```

# Deployment

## Automatically

1. Make changes to the backend code under `/backend`.
2. Push the changes to the repository `main` branch.
3. The changes will be automatically deployed to the server.

## Manually

1. Build the backend

```
npm run build
```

2. Deploy the backend by coping the `dist/apps/tilloh-dev` folder content to the server in `/home/tilloh/api`
3. Copy the `package.json` file to the server in `/home/tilloh/api`
4. Install the dependencies in the server

```
ssh <username>@<uberspace-host>
cd /home/tilloh/api
npm install --production
```

5. Restart supervisor

```
supervisorctl stop tilloh-api-daemon
supervisorctl start tilloh-api-daemon
```

4. Check the logs

```
supervisorctl tail -f tilloh-api-daemon | npx pino-pretty
```

## Documentation

As for now there is no possibility to get automated swagger documentation for websocket gateways.

The following events are available:

- `createMessage`: Creates a new message
- `findAllMessages`: Gets all the messages
- `findOneMessage`: Gets a single a message
- `updateMessage`: Updates a message
- `removeMessage`: Removes a message
- `join`: Let a user join a chat
- `typing`: Let a user know that another user is typing
