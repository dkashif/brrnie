from django.contrib import admin
from .models import FridgeItem  # Import your model

class FridgeItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantity', 'expiration_date', 'category', 'is_expired', 'date_added')  # Fields to display in the list view
    list_filter = ('category', 'is_expired')  # Add filters in the sidebar
    search_fields = ('name', 'category')  # Add search functionality
    ordering = ('-date_added',)  # Order by date_added in descending order

# Register your model
admin.site.register(FridgeItem, FridgeItemAdmin)  # Register the model with the admin interface
