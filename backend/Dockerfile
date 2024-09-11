FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH="/code:${PYTHONPATH}"

# Установка pipx для установки Poetry
RUN python3 -m pip install --no-cache-dir pipx && \
    python3 -m pipx ensurepath

# Проверка переменных окружения
RUN printenv

# Установка Poetry
ENV PATH="/root/.local/bin:${PATH}"
RUN pipx install poetry

# Установка gettext
RUN apt-get update && \
    apt-get install -y gettext && \
    rm -rf /var/lib/apt/lists/*

# Настройка Poetry для использования глобального окружения
RUN poetry config virtualenvs.create false

# Создание рабочей директории
WORKDIR /code

# Копируйте файлы конфигурации Poetry
COPY pyproject.toml poetry.lock ./

# Установка зависимости
RUN poetry install --no-interaction --no-ansi

# Копирывание проектный код
COPY . .

## Настройка окружения
ENV PORT=8000

EXPOSE ${PORT}
