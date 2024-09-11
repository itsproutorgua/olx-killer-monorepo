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
- **gunicorn**: WSGI server for deployment.

## Database:

- **PostgreSQL**: Relational database management system for storing and managing data.

## Development Tools:

- **black**: Code formatter for consistent code style.
- **pre-commit**: Framework for managing and maintaining multi-language pre-commit hooks.
- **isort**: Import sorting for clean and organized imports.
- **flake8**: Linter for checking code quality and style.
- **django-extensions**: Additional features and tools for Django.
- **django-debug-toolbar**: Debugging and profiling tool for Django applications.

## Start Docker:

### Prerequisites

Make sure you have Docker and Docker Compose installed on your machine.

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
   ```bash
    docker-compose up --build
    ```
   
5. **Create superuser**
   ```bash
    docker-compose exec backend python manage.py createsuperuser 
    ```
   Enter your email address and password
   

### URLS:
   - [admin-site](http://localhost:8000/ru/admin/)
   - [rosetta](http://localhost:8000/rosetta/)
   - [swagger](http://localhost:8000/api/v1/swagger/)