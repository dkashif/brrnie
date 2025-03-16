from django.shortcuts import render

from rest_framework import viewsets
from .models import FridgeItem
from .serializers import FridgeItemSerializer
from .serializers import FridgeItemMyVersionSerializer
from rest_framework.permissions import AllowAny

class FridgeItemViewSet(viewsets.ModelViewSet):
    queryset = FridgeItem.objects.all()
    serializer_class = FridgeItemSerializer
    http_method_names = ['get', 'post', 'head', 'put', 'patch', 'delete']  # Ensure PUT and PATCH are allowed

class FridgeItemViewSetMyVersion(viewsets.ModelViewSet):
    serializer_class = FridgeItemMyVersionSerializer
    permission_classes = [AllowAny] #permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'put', 'patch', 'delete']

    def get_queryset(self):
        """
        This view should return a list of all the fridge items
        for the currently authenticated user.
        """
        user = self.request.user
        return FridgeItem.objects.filter(fridge__user=user)