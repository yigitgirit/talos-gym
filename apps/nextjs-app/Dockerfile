# ===================================================================
# Build Stage
# Creates the optimized production build.
# ===================================================================
FROM node:24-alpine AS build
WORKDIR /app

# Copy package.json and lockfile
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your source code
COPY . .

# Run the Next.js build with cache optimization
RUN --mount=type=cache,target=/app/.next/cache npm run build

# ===================================================================
# Production Stage
# Creates the final, small, and secure image for production.
# ===================================================================
FROM node:24-alpine
WORKDIR /app

# Set user to 'node' for better security
USER node

# Copy the optimized standalone output from the 'build' stage
# This only works because you have 'output: "standalone"' in next.config.js
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

EXPOSE 3000

ENV PORT 3000

# Start the optimized Node.js server
CMD ["node", "server.js"]
