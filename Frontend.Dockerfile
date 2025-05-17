FROM --platform=linux/amd64 node:22-alpine AS node

FROM --platform=linux/amd64 nginxinc/nginx-unprivileged:alpine-slim

################## Install some basics on root-level ########################
USER root

RUN apk upgrade -U && apk add bash grep sed

RUN    chown -R nginx:nginx /etc/nginx/conf.d && \
       chown -R nginx:nginx /usr/share/nginx && \
       chown -R nginx:nginx /var/cache/nginx && \
       chown -R nginx:nginx /var/log/nginx

################## Switch to nginx user and install nodejs application #######
USER nginx

WORKDIR /static

COPY --chown=nginx frontend/dist/. /usr/share/nginx/html/

COPY --chown=nginx frontend/config-template.json /usr/share/nginx/html/config/config.json

COPY --chown=nginx frontend-nginx.conf /etc/nginx/conf.d/default.conf

COPY --chown=nginx frontend/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

WORKDIR /usr/share/nginx/html/

STOPSIGNAL SIGQUIT

EXPOSE 5173

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]