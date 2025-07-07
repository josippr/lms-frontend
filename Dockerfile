FROM nginx:alpine

# Copy built React app (static files)
COPY dist/ /usr/share/nginx/html

# Copy custom Nginx configuration
COPY ./nginx-fe.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx default)
EXPOSE 80
