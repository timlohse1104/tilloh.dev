# Frontend

## Application

The svelte frontend is available at `https://tilloh.dev`.

## Development

1. Install dependencies

```
cd frontend
npm install
```

2. Start the development server

```
cd frontend
npm run dev
```

3. Open the browser at `http://localhost:5173`
4. Make changes to the code and see the changes in the browser
5. Press `strg + c` to stop the server

# Deployment

## Automatic Deployment

1. Make changes to the frontend code under `/frontend`
2. Push the changes to the repository `main` branch
3. The changes will be automatically deployed to the server

## Manual Deployment

1. Build the frontend

```
npm run build
```

2. Deploy the frontend by coping the `dist` folder content to the server in /home/tilloh/html

3. Reload website with strg + f5
