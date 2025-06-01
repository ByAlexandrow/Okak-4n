from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from workers.models import ActiveToken


class WhitelistJWTAuthentication(JWTAuthentication):
    def get_validated_token(self, raw_token):
        validated_token = super().get_validated_token(raw_token)
        jti = validated_token.get('jti')
        if not ActiveToken.objects.filter(jti=jti).exists():
            raise AuthenticationFailed('Token is not in whitelist')
        return validated_token
