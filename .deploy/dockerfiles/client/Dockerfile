# Stage 1: Build React application
FROM node:20.12.2-alpine3.18 AS builder
RUN apk add --no-cache python3 make g++ \
    && corepack enable \
    && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/client/package.json ./apps/client/
COPY apps/server/package.json ./apps/server/
RUN pnpm install --frozen-lockfile
COPY . .
RUN cp .env ./apps/client/
RUN pnpm run frontend:build


# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/apps/client/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY .deploy/nginx/nginx.conf /etc/nginx/nginx.conf
COPY .deploy/nginx/proxy.conf /etc/nginx/templates/proxy.conf
COPY .deploy/entrypoint/frontend-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE ${NGINX_PORT}
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
