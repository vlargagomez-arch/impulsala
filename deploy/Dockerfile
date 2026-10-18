# Imagen de producción de Impulsala (Next.js standalone + Prisma).
# Build:  docker build -f deploy/Dockerfile -t impulsala .
# Uso normal: docker compose -f deploy/docker-compose.yml up -d --build

FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# prepare-prod.cjs normaliza el schema a postgresql; prisma generate deja el cliente listo
RUN node scripts/prepare-prod.cjs && bunx prisma generate && bunx next build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "server.js"]
