# tilloh.dev

This is the source code for my personal website, [tilloh.dev](https://tilloh.dev).

This monorepo is divided into two main parts: frontend and backend and is powered by nx.

## Frontend

The frontend is a single-page application that serves as a portfolio for my projects and useful features for Friends and Family. Furthermore it is a place for me to experiment with new technologies and ideas. At the moment it consists of the memorandum, a joke library, a chat, lists a brick breaker game, a food scanner and a showcase how to sort uno cards.

It is built with SvelteKit and Svelte Material UI.

## Backend

The backend is a REST API that powers the frontend. It consists of generated identifiers for user sessions, an ocr feature, a joke scraper and a key-value store to store link information.

The backend is built with NestJS and Swagger.

## Development

Before committing changes it is necessary to fix all linting errors. After cloning this repository, `npm install` will automatically install a pre-commit hook that will run the linter before committing changes!

Start frontend and backend development server with `npm run dev`.

### Gitmoji

This repository uses [gitmoji](https://gitmoji.dev/) to categorize commits. By installing npm dependencies in the root of this repository, a post-commit hook will automatically add a gitmoji to your commit message. If you want to disable this feature, you can remove the post-commit hook by running `rm .git/hooks/post-commit`.
