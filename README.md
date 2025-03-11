# tilloh.dev

This is the source code for my personal website, [tilloh.dev](https://tilloh.dev).

This monorepo is divided into two main parts: frontend and backend and is powered by nx.

## Frontend

The frontend is a single-page application that serves as a portfolio for my projects and useful features for Friends and Family. Furthermore it is a place for me to experiment with new technologies and ideas. At the moment it consists of the memorandum, a joke library, a chat, a todo list a brick breaker game, a food scanner and a showcase how to sort uno cards.

It is built with SvelteKit and Svelte Material UI.

### Run with docker

To run the frontend using Docker, you can use the provided Dockerfile. First, ensure Docker is installed on your system. Then, navigate to the root directory of the project and execute the following commands:

1. Build the image

`docker build -t tilloh-dev-frontend -f Frontend.Dockerfile .`

2. Run the container

`docker run -d -p 5173:5173 tilloh-dev-frontend`

## Backend

The backend is a REST API that powers the frontend. It consists of generated identifiers for user sessions, an ocr feature, a joke scraper and a key-value store to store link information.

The backend is built with NestJS and Swagger.

### Run with docker

To run the backend using Docker, you can use the provided Dockerfile. Just like with the frontend, ensure Docker is installed on your system. Then, navigate to the root directory of the project and execute the following commands:

1. Build the image

`docker build -t tilloh-dev-backend -f Backend.Dockerfile .`

2. Run the container

`docker run -d -p 61154:61154 tilloh-dev-backend`

## Development

Before committing changes it is necessary to fix all linting errors. After cloning this repository, `npm install` will automatically install a pre-commit hook that will run the linter before committing changes!

Start frontend and backend development server with `npm run dev`.

### Gitmoji

This repository uses [gitmoji](https://gitmoji.dev/) to categorize commits. By installing npm dependencies in the root of this repository, a post-commit hook will automatically add a gitmoji to your commit message. If you want to disable this feature, you can remove the post-commit hook by running `rm .git/hooks/post-commit`.
