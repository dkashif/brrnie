from django.contrib import admin
from .models import FridgeItem  # Import your model
from .models import Fridge, FridgeItem


# Register FridgeItem inline (optional — to show items within the Fridge model)
class FridgeItemInline(admin.TabularInline):
    model = FridgeItem
    extra = 1

# Register Fridge model
@admin.register(Fridge)
class FridgeAdmin(admin.ModelAdmin):
    list_display = ('user',)
    inlines = [FridgeItemInline]

@admin.register(FridgeItem)
class FridgeItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantity', 'expiration_date', 'category', 'fridge')
    list_filter = ('category', 'is_expired')
    search_fields = ('name', 'category')  # Add search functionality
    ordering = ('-date_added',)  # Order by date_added in descending order