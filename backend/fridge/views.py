from django.shortcuts import render

from rest_framework import viewsets
from .models import FridgeItem
from .serializers import FridgeItemSerializer

class FridgeItemViewSet(viewsets.ModelViewSet):
    queryset = FridgeItem.objects.all()
    serializer_class = FridgeItemSerializer
    http_method_names = ['get', 'post', 'head', 'put', 'patch', 'delete']  # Ensure PUT and PATCH are allowed