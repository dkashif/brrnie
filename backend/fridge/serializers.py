from rest_framework import serializers
from .models import FridgeItem

class FridgeItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FridgeItem
        fields = '__all__'
        # read_only_fields = ('date_added', 'is_expired')  # Uncomment if you want these fields to be read-only
