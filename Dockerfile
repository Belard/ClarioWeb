# ─────────────────────────────────────────────────────────────
# Stage 1 – base: shared Node.js layer
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ─────────────────────────────────────────────────────────────
# Stage 2 – dev: Vite development server (with HMR)
# ─────────────────────────────────────────────────────────────
FROM base AS dev
# Source files are bind-mounted at runtime by docker-compose,
# so we only copy here for standalone `docker build --target dev` use.
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ─────────────────────────────────────────────────────────────
# Stage 3 – build: compile & bundle the React app
# ─────────────────────────────────────────────────────────────
FROM base AS build
COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 4 – prod: serve the built assets with nginx
# ─────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
