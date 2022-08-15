wsgi_app = "time_machine.wsgi"

timeout = 30
graceful_timeout = 30
keepalive = 65
worker_class = "gevent"

errorlog = "-"
accesslog = "-"
loglevel = "debug"
capture_output = True

forwarded_allow_ips = "*"
proxy_allow_ips = "*"
