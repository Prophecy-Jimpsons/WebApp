# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install Python and other build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    linux-headers \
    eudev-dev \
    libusb-dev \
    udev \
    build-base \
    libc6-compat

# Set Python path explicitly and create symlink
RUN ln -sf /usr/bin/python3 /usr/bin/python && \
    ln -sf /usr/bin/python3 /usr/local/bin/python && \
    npm config set python /usr/bin/python3

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with increased timeout
RUN yarn install --frozen-lockfile --network-timeout 300000

# Copy source files
COPY . .

# Build TypeScript and Vite
RUN yarn build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    python3 \
    libusb \
    eudev \
    udev \
    libc6-compat

# Set Python path for production
RUN ln -sf /usr/bin/python3 /usr/bin/python && \
    ln -sf /usr/bin/python3 /usr/local/bin/python && \
    npm config set python /usr/bin/python3

# Copy built files and production dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock

# Install only production dependencies
RUN yarn install --production --frozen-lockfile --network-timeout 300000

# Environment setup
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

# Expose port
EXPOSE 8080

# Use a more production-ready server
RUN yarn add serve

# Start serve instead of preview
CMD ["yarn", "serve", "-s", "dist", "-l", "8080"]
