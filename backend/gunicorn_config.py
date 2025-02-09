# local windows
# uvicorn apps.asgi:application --reload --host 0.0.0.0 --port 8000

import logging.config
import multiprocessing

from settings.logging import LOGGING


logging.config.dictConfig(LOGGING)

bind = '0.0.0.0:8000'
module = 'apps.wsgi:application'
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'gthread'
threads = 4
worker_connections = 1000
timeout = 30

accesslog = '-'  # Для вывода логов доступа в stdout
errorlog = '-'  # Для вывода логов ошибок в stdout

access_log_format = '%(h)s "%(r)s" %(s)s %(b)s'

# Стандартный вывод
# %(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"

# %(h)s - IP-адрес клиента (хоста)
# %(l)s - Идентификатор пользователя RFC 1413 (обычно -, т. к. не используется)
# %(u)s - Имя аутентифицированного пользователя (если есть)	- или admin
# %(t)s - Время запроса (формат: [дд/ММ/гггг:чч:мм:сс +часовой_пояс])
# %(r)s - Полный HTTP-запрос (метод, URL, протокол)
# %(s)s - HTTP-статус-код ответа
# %(b)s - Размер тела ответа (в байтах)
# %(f)s - HTTP Referer (страница, с которой пришёл запрос)
# %(a)s - User-Agent (информация о браузере клиента)
