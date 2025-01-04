# =====================================
# Build Stage
# =====================================
FROM node:20-alpine AS build

# Set working directory for build stage
WORKDIR /app

# Install essential build dependencies
# These packages are required for node-gyp and native module compilation
RUN apk add --no-cache \
    # Python is required for node-gyp
    python3 \
    # Essential build tools
    make \
    g++ \
    build-base \
    # Required for USB support
    linux-headers \
    eudev-dev \
    libusb-dev \
    udev \
    # Required for Alpine Linux compatibility
    libc6-compat \
    # Create symbolic link for Python
    && ln -sf python3 /usr/bin/python

# Configure Python environment
# This ensures node-gyp can find and use Python correctly
ENV PYTHON=/usr/bin/python3
RUN python3 --version && which python3

# Configure npm to use the correct Python installation
# This helps prevent Python detection issues during build
RUN npm config set python /usr/bin/python3

# Copy package management files
# Copying these files separately enables better layer caching
COPY package.json yarn.lock ./

# Install dependencies with specific flags
# --frozen-lockfile: Ensures consistent installations
# --network-timeout: Prevents timeout issues during installation
# --build-from-source: Ensures native modules are compiled properly
RUN yarn install --frozen-lockfile --network-timeout 300000 --build-from-source

# Copy the rest of the application code
COPY . .

# Build the application
# This step compiles TypeScript and bundles with Vite
RUN yarn build

# =====================================
# Production Stage
# =====================================
FROM node:20-alpine

# Set working directory for production stage
WORKDIR /app

# Install runtime dependencies
# These are the minimal packages required to run the application
RUN apk add --no-cache \
    # Required for running Python scripts
    python3 \
    # USB runtime dependencies
    libusb \
    eudev \
    udev \
    # Alpine Linux compatibility
    libc6-compat \
    # Create symbolic link for Python
    && ln -sf python3 /usr/bin/python

# Configure Python environment for production
ENV PYTHON=/usr/bin/python3
RUN npm config set python /usr/bin/python3

# Copy built files and dependencies from build stage
# Only copying necessary files reduces the final image size
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock

# Install production dependencies only
# This reduces the final image size by excluding development dependencies
RUN yarn install --production --frozen-lockfile --network-timeout 300000

# Configure environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

# Expose the application port
EXPOSE 8080

# Install serve for production-ready static file serving
RUN yarn add serve

# Start the application using serve
# -s: Serves as a single-page application
# -l: Specifies the listening port
CMD ["yarn", "serve", "-s", "dist", "-l", "8080"]