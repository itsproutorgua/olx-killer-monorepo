FROM python:3.12-slim

# Установка переменных окружения
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/code:${PYTHONPATH}"
ENV PATH="/root/.local/bin:${PATH}"

# Установка pipx и Poetry
RUN apt-get update && \
    apt-get install -y gettext && \
    python3 -m pip install --no-cache-dir pipx && \
    python3 -m pipx install poetry && \
    rm -rf /var/lib/apt/lists/*

# Настройка Poetry для использования глобального окружения
RUN poetry config virtualenvs.create false

# Создание рабочей директории
WORKDIR /code

# Копирование файлов конфигурации Poetry
COPY pyproject.toml poetry.lock ./

# Установка зависимостей
RUN poetry install --no-interaction --no-ansi

# Копирование проектного кода
COPY . .

# Настройка окружения
ENV PORT=8000

# Экспорт порта
EXPOSE ${PORT}
