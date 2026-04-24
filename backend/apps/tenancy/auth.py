import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions

User = get_user_model()


class SupabaseJWTAuthentication(authentication.BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request):
        header = authentication.get_authorization_header(request).decode("utf-8")

        if not header:
            return None

        parts = header.split()
        if len(parts) != 2 or parts[0] != self.keyword:
            raise exceptions.AuthenticationFailed("Invalid authorization header format.")

        if not settings.SUPABASE_JWT_SECRET:
            raise exceptions.AuthenticationFailed("SUPABASE_JWT_SECRET is not configured.")

        token = parts[1]

        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=[settings.SUPABASE_JWT_ALGORITHM],
                audience=settings.SUPABASE_JWT_AUDIENCE,
            )
        except jwt.PyJWTError as exc:
            raise exceptions.AuthenticationFailed("Invalid Supabase token.") from exc

        subject = payload.get("sub")
        if not subject:
            raise exceptions.AuthenticationFailed("Token subject is missing.")

        user, _ = User.objects.get_or_create(
            username=subject,
            defaults={"email": payload.get("email", "")},
        )

        email = payload.get("email") or ""
        if user.email != email:
            user.email = email
            user.save(update_fields=["email"])

        return user, payload
