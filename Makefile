.PHONY: empty
empty:

.PHONY: run
run:
	docker-compose up

.PHONY: build
build:
	docker-compose build --no-cache

.PHONY: backup-firebase
backup-firebase:
	docker-compose exec firebase rm -fR /var/local/firebase/export_data/firestore_export
	docker-compose exec firebase firebase emulators:export --project demo-local --force /var/local/firebase/export_data/firestore_export

.PHONY: coverage
coverage:
	docker-compose exec firebase npm run coverage
	cp -r ./functions/coverage app/public/
	explorer http://localhost:53001/coverage/lcov-report/index.html
