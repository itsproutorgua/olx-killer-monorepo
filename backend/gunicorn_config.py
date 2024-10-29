import multiprocessing


bind = '0.0.0.0:8000'
module = "apps.wsgi:application"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'gthread'
threads = 4
worker_connections = 1000
timeout = 30
loglevel = 'info'
