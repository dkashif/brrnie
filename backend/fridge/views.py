from django.shortcuts import render

from rest_framework import viewsets
from .models import FridgeItem
from .serializers import FridgeItemSerializer
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated


class FridgeItemViewSet(viewsets.ModelViewSet):
    serializer_class = FridgeItemSerializer
    permission_classes = [IsAuthenticated]  # Restrict access to authenticated users
    http_method_names = ["get", "post", "head", "put", "patch", "delete"]

    def get_queryset(self):
        user = self.request.user
        return FridgeItem.objects.filter(fridge__user=user)

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            return response
        except Exception as e:
            print("Error:", str(e))  # Log the error message
            raise

    def perform_create(self, serializer):
        fridge = (
            self.request.user.fridge
        )  # assuming you have a OneToOne from User to Fridge
        serializer.save(fridge=fridge)
