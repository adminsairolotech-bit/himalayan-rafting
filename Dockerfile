FROM nginx:alpine

# Copy static files
COPY . /usr/share/nginx/html

# Custom nginx config for SPA routing
RUN echo 'server {\n    listen 8080;\n    server_name localhost;\n    root /usr/share/nginx/html;\n    index index.html;\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]