from django.contrib import admin
from .models import FridgeItem  # Import your model
from .models import Fridge, FridgeItemMyVersion

class FridgeItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantity', 'expiration_date', 'category', 'is_expired', 'date_added')  # Fields to display in the list view
    list_filter = ('category', 'is_expired')  # Add filters in the sidebar
    search_fields = ('name', 'category')  # Add search functionality
    ordering = ('-date_added',)  # Order by date_added in descending order

# Register your model
admin.site.register(FridgeItem, FridgeItemAdmin)  # Register the model with the admin interface

# Register FridgeItem inline (optional — to show items within the Fridge model)
class FridgeItemInline(admin.TabularInline):
    model = FridgeItemMyVersion
    extra = 1

# Register Fridge model
@admin.register(Fridge)
class FridgeAdmin(admin.ModelAdmin):
    list_display = ('user',)
    inlines = [FridgeItemInline]

@admin.register(FridgeItemMyVersion)
class FridgeItemMyVersionAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantity', 'expiration_date', 'category', 'fridge')
    list_filter = ('category', 'is_expired')
    search_fields = ('name',)