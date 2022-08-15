from datetime import datetime


def get_timestamp():
    return int(datetime.utcnow().timestamp() * 1000)
