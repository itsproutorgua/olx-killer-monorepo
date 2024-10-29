[![Python](https://img.shields.io/badge/-Python-%233776AB?style=for-the-badge&logo=python&logoColor=white&labelColor=0a0a0a)](https://www.python.org/)
[![Django Rest Framework](https://img.shields.io/badge/-Django%20Rest%20Framework-%2300B96F?style=for-the-badge&logo=django&logoColor=white&labelColor=0a0a0a)](https://www.django-rest-framework.org/)
[![Jazzmin](https://img.shields.io/badge/-Jazzmin-%2343B02A?style=for-the-badge&logo=django&logoColor=white&labelColor=0a0a0a)](https://django-jazzmin.readthedocs.io/)
[![Django Storages](https://img.shields.io/badge/-Django%20Storages-%230F9B9A?style=for-the-badge&logo=django&logoColor=white&labelColor=0a0a0a)](https://django-storages.readthedocs.io/en/latest/)
[![Django Simple History](https://img.shields.io/badge/-Django%20Simple%20History-%23FF4C4C?style=for-the-badge&logo=django&logoColor=white&labelColor=0a0a0a)](https://django-simple-history.readthedocs.io/en/latest/)
[![JWT Authentication](https://img.shields.io/badge/-JWT%20Authentication-%23FFB300?style=for-the-badge&logo=json-web-tokens&logoColor=white&labelColor=0a0a0a)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/-Swagger-%2385EA2D?style=for-the-badge&logo=swagger&logoColor=white&labelColor=0a0a0a)](https://swagger.io/)
[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-%23316192?style=for-the-badge&logo=postgresql&logoColor=white&labelColor=0a0a0a)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/-Redis-%3DE345?style=for-the-badge&logo=redis&logoColor=white&labelColor=black)](https://pypi.org/project/django-redis/)
[![Celery](https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=white&labelColor=0a0a0a)](https://docs.celeryproject.org/en/stable/)
[![Docker](https://img.shields.io/badge/-Docker-%232496ED?style=for-the-badge&logo=docker&logoColor=white&labelColor=0a0a0a)](https://www.docker.com/)
[![AWS-S3](https://img.shields.io/badge/AWS-S3-569A31?style=for-the-badge&logo=AWS&logoColor=white&labelColor=0a0a0a)](https://aws.amazon.com/s3/)
[![pre-commit](https://img.shields.io/badge/-pre--commit-yellow?style=for-the-badge&logo=pre-commit&logoColor=white&labelColor=0a0a0a)](https://pre-commit.com/)
[![isort](https://img.shields.io/badge/isort-C86118?style=for-the-badge&logo=python&logoColor=white&labelColor=black)](https://pycqa.github.io/isort/)
[![boto3](https://img.shields.io/badge/boto3-569A31?style=for-the-badge&logo=AWS&logoColor=white&labelColor=0a0a0a)](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html)

# OLX Killer App

## Tech Stack

- **Django**: Web framework.
- **Django REST Framework (DRF)**: For building web APIs.
- **drf-spectacular**: OpenAPI 3 schema generation and documentation.
- **Swagger**: Interactive API documentation.
- **i18n_patterns**: Internationalization and localization.
- **django-rosetta**: Translation management.
- **Auth0**: Authentication and authorization.
- **django-anymail**: Email service integration.
- **django-cors-headers**: CORS handling.
- **django-environ**: Environment variable management.
- **django-modeltranslation**: Multilingual support for models.
- **django-jazzmin**: Modern and customizable Django admin interface.
- **gunicorn**: WSGI server for deployment.
- **Celery**: Task queue for asynchronous processing.

## Database:

- **PostgreSQL**: Relational database management system for storing and managing data.
- **Redis**: In-memory data structure store, used as a database, cache, and message broker.

## Development Tools:

- **black**: Code formatter for consistent code style.
- **pre-commit**: Framework for managing and maintaining multi-language pre-commit hooks.
- **isort**: Import sorting for clean and organized imports.
- **flake8**: Linter for checking code quality and style.
- **django-extensions**: Additional features and tools for Django.
- **django-debug-toolbar**: Debugging and profiling tool for Django applications.

## Dependencies

- Django 5.x
- Django REST Framework 3.x
- Celery 5.x
- Redis 5.x
- PostgreSQL 12+
- boto3 1.x

## Start Docker:

### Prerequisites

Make sure you have Docker and Docker Compose installed and upgrade on your machine.

- [Docker Installation Guide](https://docs.docker.com/get-docker/)
- [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)


1. **Clone the repository:**

    ```bash
    git clone https://github.com/itsproutorg/olx-killer-monorepo.git
    ```

2. **Navigate to the project directory:**

   ```bash
    cd backend
    ```

3. In root project [olx_killer](./):

   *if you don't have .env:*
    - create file `.env`
      ```bash
      cp .env-example .env
      ```
    - Fill in the actual values for your local setup in the `.env` file.

4. **Start the development server:**
   ### First start project
   ```bash
    docker-compose build --no-cache && docker-compose up
    ```
   ### If you already have the image built
   ```bash
   docker-compose up
   ```
   ### If you need rebuild the image built
   ```bash
   docker-compose up --build
   ```
   ### Stop Docker Compose
   ```bash
   docker-compose down
   ```
   Or press `Ctrl + C` to stop it.
   ### Stop Docker Compose and delete volumes
   ```bash
   docker-compose down -v
   ```

### URLS:

- [admin-site](http://localhost:8000/uk/olx-killer-admin/)
- [rosetta](http://localhost:8000/rosetta/)
- [swagger](http://localhost:8000/api/v1/swagger/)