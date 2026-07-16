FROM node:22-alpine AS frontend-build

WORKDIR /frontend

COPY frontend/messenger/package.json frontend/messenger/package-lock.json ./
RUN npm ci

COPY frontend/messenger/ ./
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html

EXPOSE 80
