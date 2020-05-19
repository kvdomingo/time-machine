from .serializers import UserSerializer


def jwt_response_handler(token, user=None, request=None):
    return dict(
        token = token,
        user = UserSerializer(user, context=dict(
            request = request
        )).data
    )
