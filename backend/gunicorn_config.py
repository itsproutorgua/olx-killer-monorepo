import multiprocessing


bind = '0.0.0.0:8000'
module = 'apps.wsgi:application'
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'gthread'
threads = 4
worker_connections = 1000
timeout = 30

# Настройки для логирования Gunicorn
loglevel = 'info'  # Уровень логирования

# Настройки формата для запросов Gunicorn
access_log_format = '%(t)s %(h)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'
