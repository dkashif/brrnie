from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, UserProfileSerializer  # Make sure you import the UserProfileSerializer
from accounts.models import UserProfile
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        # Serialize the incoming request data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        tokens = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        # Fetch the UserProfile for the created user
        user_profile = UserProfile.objects.get(user=user)
        
        # Serialize the UserProfile
        user_profile_serializer = UserProfileSerializer(user_profile)

        return Response(
            {
                "user": UserSerializer(user).data,  # User data
                "tokens": tokens,                   # JWT tokens
                "user_profile": user_profile_serializer.data  # UserProfile data
            },
            status=status.HTTP_201_CREATED,
        )

class UserProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the profile of the currently authenticated user
        return self.request.user.userprofile