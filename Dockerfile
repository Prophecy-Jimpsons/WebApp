# Build stage
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Install dependencies using apk
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Copy package files
COPY package.json yarn.lock ./

# Clear yarn cache and install dependencies
RUN yarn cache clean && \
    yarn install --frozen-lockfile --network-timeout 1000000

# Copy source files
COPY . .

# Build with increased memory allocation
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy build files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name jimpsons.com www.jimpsons.com; \
    return 301 https://$host$request_uri; \
} \
server { \
    listen 443 ssl; \
    server_name jimpsons.com www.jimpsons.com; \
    ssl_certificate /etc/letsencrypt/live/jimpsons.com/fullchain.pem; \
    ssl_certificate_key /etc/letsencrypt/live/jimpsons.com/privkey.pem; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
