# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies for node-gyp (if needed)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --network-timeout 100000

# Copy source files
COPY . .

# Build TypeScript and Vite
RUN yarn build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy built files and necessary configs
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock
COPY --from=build /app/vite.config.ts ./vite.config.ts

# Install production dependencies only
RUN yarn install --production --frozen-lockfile --network-timeout 100000

# Environment setup
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

# Healthcheck with increased timeout
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/index.html || exit 1

# Expose port
EXPOSE ${PORT}

# Start Vite preview server with explicit host and port
CMD ["yarn", "preview", "--host", "0.0.0.0", "--port", "8080", "--strictPort"]
