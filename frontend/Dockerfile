# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies) - required for building Next.js (Tailwind / lightningcss)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Create non-root user (Debian slim uses groupadd/useradd).
# Create the user's home directory at build time so ownership is correct.
RUN groupadd -g 1001 nodejs \
 && useradd -u 1001 -g nodejs -s /usr/sbin/nologin -m -d /home/nextjs nextjs

# Change ownership of the app directory and home directory, then switch to non-root user
RUN chown -R nextjs:nodejs /app /home/nextjs
ENV HOME=/home/nextjs
USER nextjs
# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# Start the application
CMD ["npm", "start"]