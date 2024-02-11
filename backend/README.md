# Backend

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

## Deployment

1. Build the backend

```
npm run build
```

2. Deploy the backend by coping the `dist/apps/backend` folder content to the server in /home/tilloh/api

3. Restart supervisor

```
supervisorctl stop tilloh-api-daemon
supervisorctl start tilloh-api-daemon
```
