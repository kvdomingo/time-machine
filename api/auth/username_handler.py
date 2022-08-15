from rest_framework.authentication import authenticate


def get_username_from_payload_handler(payload):
    username = payload.get("cognito:username")
    authenticate(remote_user=username)
    return username
