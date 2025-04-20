from rest_framework import serializers
from .models import FridgeItem
from django.utils import timezone
from django.core.validators import MaxLengthValidator


class FridgeItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FridgeItem
        fields = "__all__"
        read_only_fields = ["fridge"]  # Add this line

    # Custom validation for the 'name' field
    name = serializers.CharField(
        required=True,
        error_messages={
            "required": "Please provide a name for the item.",
            "blank": "The name cannot be left blank.",
            "max_length": "Name cannot exceed 255 characters.",
        },
    )

    # Custom validation for the 'quantity' field
    quantity = serializers.IntegerField(
        required=True,
        error_messages={"required": "Please provide a quantity for the item."},
    )

    # Custom validation for the 'expiration_date' field
    expiration_date = serializers.DateField(
        required=True,
        error_messages={
            "required": "Expiration date cannot be left empty. Please provide a valid date.",
            "invalid": "Invalid date format. Please use MM/DD/YYYY.",
        },
    )

    # Custom validation for the 'category' field
    category = serializers.ChoiceField(
        choices=[
            ("PL", "Please select a category (Required)"),
            ("PR", "Produce"),
            ("GR", "Grains"),
            ("DR", "Dairy"),
            ("MS", "Meat/Seafood"),
            ("DM", "Deli Meats"),
            ("PF", "Prepared Foods"),
            ("BE", "Beverages"),
            ("CO", "Condiments"),
            ("EG", "Eggs"),
            ("OT", "Other"),
        ],
        default="PL",
        error_messages={"invalid_choice": "Please select a valid category."},
    )

    # Create method to check for duplicates before creating a new item
    def create(self, validated_data):
        # Remove the duplicate check if duplicates are allowed
        return super().create(validated_data)

    def validate_name(self, value):
        """Custom validation to enforce max length and include the actual length in the error message."""
        max_length = 255
        if len(value) > max_length:
            raise serializers.ValidationError(
                f"Name cannot exceed {max_length} characters. It has {len(value)}."
            )
        return value

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "The quantity cannot be a negative number."
            )
        if value == 0:
            raise serializers.ValidationError("The quantity must be greater than zero.")
        return value

    def validate_expiration_date(self, value):
        if (
            value <= timezone.now().date()
        ):  # Check if the expiration date is in the future
            raise serializers.ValidationError(
                "Expiration date must be a future date. Please check your input."
            )
        return value

    def validate_category(self, value):
        if value == "PL":
            raise serializers.ValidationError("*Required")
        return value
