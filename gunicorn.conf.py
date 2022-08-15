wsgi_app = "time_machine.wsgi"

timeout = 30
graceful_timeout = 30
keepalive = 65

errorlog = "-"
accesslog = "-"
loglevel = "debug"
capture_output = True

forwarded_allow_ips = "*"
proxy_allow_ips = "*"


def when_ready(_):
    import os

    import django

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "playground.settings")
    django.setup()

    from api.tasks import startup

    startup()
