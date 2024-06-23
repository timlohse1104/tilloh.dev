# Frontend

## Application

The svelte frontend is available at `https://tilloh.dev`.

## Toggles

There are a few usable toggles in the frontend. These can be created in the admin panel under `Toggles`. The following toggles are available:

1. **TOGGLE_RANDOM-JOKE**: Show a random joke on the home page.
2. **TOGGLE_ADMIN-DASHBOARD**: Show the dashboard in admin panel.
3. **TOGGLE_ADMIN-ACTIVITIES**: Show the activities in admin panel.
4. **TOGGLE_ADMIN-IDENTIFIERS**: Show the identifiers in admin panel.
5. **TOGGLE_ADMIN-LINK-PRESETS**: Show the link presets in admin panel.

## Development

1. Install dependencies.

```
cd frontend
npm install
```

2. Start the development server.

```
cd frontend
npm run dev
```

3. Open the browser at `http://localhost:5173`.
4. Make changes to the frontend code and see the changes in the browser.
5. Press `strg + c` to stop the server.

# Deployment

## Automatically

1. Make changes to the frontend code under `/frontend`.
2. Push the changes to the repository `main` branch.
3. The changes will be automatically deployed to the server.

## Manually

1. Build the frontend

```
npm run build
```

2. Deploy the frontend by coping the `dist` folder content to the server in `/home/tilloh/html`.
3. Reload website.
