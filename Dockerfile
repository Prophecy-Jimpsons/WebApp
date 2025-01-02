# Build stage
FROM node:18 AS build
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies (including dev dependencies)
RUN yarn install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:18-slim
WORKDIR /app

# Copy only the built assets and package files
COPY --from=build /app/dist ./dist
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

ENV PORT=8080
ENV HOST=0.0.0.0

# Expose the port
EXPOSE 8080

# Start the application
ENV NODE_ENV=production
CMD ["yarn", "preview", "--host", "0.0.0.0", "--port", "8080"]