from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "password", "password2")  # Only include email and password
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
        }

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError("Passwords must match.")
        return data

    def create(self, validated_data):
        validated_data.pop("password2")  # Remove password2 as it's only for validation
        user = User.objects.create_user(
            username=validated_data["email"],  # Treat email as email"],  # Treat email as username
            email=validated_data["email"],  # Store email as is
            password=validated_data["password"],
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            "notification_frequency",
            "receive_expiration_reminders",
            "days_before_expiration",
        )
        extra_kwargs = {
            "notification_frequency": {"required": False},
            "receive_expiration_reminders": {"required": False},
            "days_before_expiration": {"required": False},
        }
    def update(self, instance, validated_data):
        instance.notification_frequency = validated_data.get("notification_frequency", instance.notification_frequency)
        instance.receive_expiration_reminders = validated_data.get("receive_expiration_reminders", instance.receive_expiration_reminders)
        instance.days_before_expiration = validated_data.get("days_before_expiration", instance.days_before_expiration)
        instance.save()
        return instance
    
    