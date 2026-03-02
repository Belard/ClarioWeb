.PHONY: dev dev-build dev-rebuild dev-rebuild-logs dev-down prod prod-build prod-rebuild prod-rebuild-logs prod-down logs ps clean

# ── Development ────────────────────────────────────────────────────────────────

dev:
	docker compose up

dev-build:
	docker compose up --build

dev-rebuild:
	docker compose down && docker compose up --build -d

dev-rebuild-logs:
	docker compose down && docker compose up --build

dev-down:
	docker compose down

# ── Production ─────────────────────────────────────────────────────────────────

prod:
	docker compose -f docker-compose.prod.yml up

prod-build:
	docker compose -f docker-compose.prod.yml up --build

prod-rebuild:
	docker compose -f docker-compose.prod.yml down && docker compose -f docker-compose.prod.yml up --build -d

prod-rebuild-logs:
	docker compose -f docker-compose.prod.yml down && docker compose -f docker-compose.prod.yml up --build

prod-down:
	docker compose -f docker-compose.prod.yml down

# ── Utilities ──────────────────────────────────────────────────────────────────

logs:
	docker compose logs -f

ps:
	docker compose ps

clean:
	docker compose down --volumes --remove-orphans
	docker compose -f docker-compose.prod.yml down --volumes --remove-orphans
