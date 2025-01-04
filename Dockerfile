# Build Stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install essential build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    build-base \
    linux-headers \
    eudev-dev \
    libusb-dev \
    udev \
    libc6-compat \
    && ln -sf python3 /usr/bin/python

# Configure Python environment correctly
ENV PYTHON=/usr/bin/python3
RUN python3 --version && which python3

# Configure npm to use Python - Using correct syntax
RUN npm config set python "/usr/bin/python3" --location=global

# Copy package management files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --network-timeout 300000 --build-from-source

# Copy application code
COPY . .

# Build the application
RUN yarn build

# Production Stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    python3 \
    libusb \
    eudev \
    udev \
    libc6-compat \
    && ln -sf python3 /usr/bin/python

# Configure Python environment
ENV PYTHON=/usr/bin/python3
RUN npm config set python "/usr/bin/python3" --location=global

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock

# Install production dependencies
RUN yarn install --production --frozen-lockfile --network-timeout 300000

# Configure environment
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

# Expose port
EXPOSE 8080

# Install serve
RUN yarn add serve

# Start command
CMD ["yarn", "serve", "-s", "dist", "-l", "8080"]