# ── Stage 1: Dependencies ─────────────────────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ── Stage 2: Production image ─────────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy deps and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create logs directory
RUN mkdir -p logs

EXPOSE 5000

CMD ["node", "server.js"]
