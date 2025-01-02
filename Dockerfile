# Step 1: Build the React app
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application files
COPY . ./

# Build the Vite project
RUN yarn build

# Step 2: Set up Nginx and SSL
# FROM nginx:alpine

# Remove the default Nginx index.html
# RUN rm -rf /usr/share/nginx/html/*

# Copy the built files from the build step to Nginx's HTML directory
# COPY --from=build /app/dist /usr/share/nginx/html

# Install Certbot to manage SSL certificates
# RUN apk add --no-cache certbot nginx

# Copy custom Nginx configuration
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports for HTTP and HTTPS
EXPOSE 80 443

# Start Nginx
# CMD ["nginx", "-g", "daemon off;"]