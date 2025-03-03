from rest_framework import serializers
from .models import FridgeItem

class FridgeItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FridgeItem
        fields = ['id', 'name', 'quantity', 'expiration_date', 'category', 'date_added', 'is_expired', 'notes']



