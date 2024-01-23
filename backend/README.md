# Backend

### Deployment

1. Build the backend

```
nx run backend:build
```

2. Deploy the backend by coping the `dist/apps/backend` folder to the server in /home/tilloh/api

3. Restart supervisor

```
supervisorctl stop tilloh-api-daemon
supervisorctl start tilloh-api-daemon
```
