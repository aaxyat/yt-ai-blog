runserver:
	poetry run python manage.py runserver

superuser:
	poetry run python manage.py createsuperuser

migrate:
	poetry run python manage.py migrate

shell:
	poetry run python manage.py shell

makemigrations:
	poetry run python manage.py makemigrations

test:
	poetry run python manage.py test

secret:
	poetry run python manage.py shell -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
