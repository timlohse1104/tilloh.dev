# tilloh.dev

This is the source code for my personal website, [tilloh.dev](https://tilloh.dev).

This monorepo is divided into two main parts: the frontend and the backend and it is powered by Nx.

## Frontend

The frontend is a single page application that serves as a portfolio for my projects. Furthermore it is a place for me to experiment with new technologies and ideas. At the moment it consists of the memorandum, a chat, a todo list a brick breaker game and a showcase how to sort uno cards.

The frontend is built with SvelteKit and Svelte Material UI.

## Backend

The backend is a REST API that powers the frontend. It consists of generated identifiers for user sessions and a key-value store to store link information.

The backend is built with NestJS.

## Development

Before committing changes it is necessary to fix all linting errors. Cloning this repository will automatically install a pre-commit hook that will run the linter before committing changes!
