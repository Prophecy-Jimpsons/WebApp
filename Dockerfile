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

# Build the Vite project (adjust if using a different build script)
RUN yarn build

# Step 2: Serve the app using Nginx
FROM nginx:alpine

# Remove the default Nginx index.html
RUN rm -rf /usr/share/nginx/html/*

# Copy the built files from the build step to Nginx's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]