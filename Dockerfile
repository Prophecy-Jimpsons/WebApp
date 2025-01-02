# Step 1: Build the React app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . ./

# Build the Vite project
RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx:alpine

# Remove the default Nginx index.html
RUN rm -rf /usr/share/nginx/html/*

# Copy the built files from the build step to Nginx's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Optionally copy a custom Nginx configuration
# Uncomment the next line if you have a custom configuration file
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
