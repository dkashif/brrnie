from rest_framework import serializers
from .models import FridgeItem
from django.utils import timezone
    
class FridgeItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FridgeItem
        fields = '__all__'
        # read_only_fields = ('date_added', 'is_expired')  # Uncomment if you want these fields to be read-only

    # Create method to check for duplicates before creating a new item
    def create(self, validated_data):
        existing_item = FridgeItem.objects.filter(
            name=validated_data['name'],
            expiration_date=validated_data['expiration_date'],
            category=validated_data['category']
            ).first()
        
        if existing_item:
            raise serializers.ValidationError("This item already exists in the fridge inventory.")
        
        # If no duplicates, create the item
        return super().create(validated_data)  # Call the parent method to create the item if it doesn't exist

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name field cannot be empty.")
        return value

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        if value == 0:
            raise serializers.ValidationError("Quantity cannot be zero.")

    def validate_expiration_date(self, value):
        if not value:
            raise serializers.ValidationError("The 'expiration_date' cannot be empty.")
        if value <= timezone.now().date():  # Check if the expiration date is in the future
            raise serializers.ValidationError("The 'expiration_date' must be a future date.")
        return value
