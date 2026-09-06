# ── Stage 1: Install dependencies ──
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Pastikan devDependencies (seperti tsc/typescript) tetap terinstall saat build
# meskipun Coolify meng-inject NODE_ENV=production
ENV NODE_ENV=development

# Copy workspace config
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/

# Install all workspace deps (production + dev for build)
RUN pnpm install --frozen-lockfile --prod=false

# ── Stage 2: Build ──
FROM deps AS builder

# Copy source code
COPY packages/types ./packages/types
COPY apps/api ./apps/api

# Build types first, then API
RUN pnpm --filter @stillbuilding/types build && \
    pnpm --filter @stillbuilding/api build

# ── Stage 3: Production image ──
FROM node:22-alpine AS runner
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

ENV NODE_ENV=production

# Copy workspace config for pnpm to resolve workspace deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/

# Install production deps only
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/types/dist ./packages/types/dist

EXPOSE 3000

WORKDIR /app/apps/api
CMD ["node", "dist/index.js"]
