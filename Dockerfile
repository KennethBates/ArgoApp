# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies separately so Docker layer cache is reused on code-only changes
COPY app/package.json app/package-lock.json* ./
RUN npm ci --omit=dev

# Copy application source
COPY app/ .

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine

# Run as non-root for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

# Copy only the built artefacts from the build stage
COPY --from=build --chown=appuser:appgroup /app .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
