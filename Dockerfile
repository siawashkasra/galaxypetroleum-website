# ── Stage 1: install deps (needs build tools for better-sqlite3) ──
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: build Next.js ─────────────────────────────────────────
FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: lean production image ────────────────────────────────
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Database lives in a mounted volume so it survives container restarts
ENV DB_PATH=/data/galaxy-cms.db

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Create persistent data dirs and give nextjs user ownership
RUN mkdir -p /data /app/public/uploads && \
    chown -R nextjs:nodejs /data /app/public/uploads

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static   ./.next/static

# better-sqlite3 native binding is not always included in standalone output
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
