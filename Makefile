up:
	docker compose up -d
down:
	docker compose down -v
ps:
	docker compose ps
create-bakup-heroku-and-download-local:
	heroku pg:backups:capture --remote heroku-prd
	curl -o latest.dump (heroku pg:backups public-url --remote heroku-prd)
restore:
	docker exec -i postgres-notion-database-crawler pg_restore --verbose --clean -U notion --no-acl --no-owner -d notion < latest.dump