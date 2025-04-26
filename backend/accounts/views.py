from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    UserSerializer,
    UserProfileSerializer,
)  # Make sure you import the UserProfileSerializer
from accounts.models import UserProfile
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.db import transaction


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Ensure UserProfile exists
        user_profile, created = UserProfile.objects.get_or_create(user=user)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        tokens = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        user_profile_serializer = UserProfileSerializer(user_profile)

        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": tokens,
                "user_profile": user_profile_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class UserProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the profile of the currently authenticated user
        return self.request.user.userprofile
