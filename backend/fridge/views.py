from django.shortcuts import render

from rest_framework import viewsets
from .models import FridgeItem
from .serializers import FridgeItemSerializer
from rest_framework.permissions import AllowAny


class FridgeItemViewSet(viewsets.ModelViewSet):
    serializer_class = FridgeItemSerializer
    permission_classes = [AllowAny]  # permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "head", "put", "patch", "delete"]

    def get_queryset(self):
        """
        This view should return a list of all the fridge items
        for the currently authenticated user.
        """
        user = self.request.user
        return FridgeItem.objects.filter(fridge__user=user)
