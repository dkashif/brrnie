from django.db import models
from django.utils import timezone
from django.conf import settings

CATEGORY_CHOICES = [
    ('PL', 'Please select a category (Required)'), # Placeholder for selection
    ('PR', 'Produce'),    # Fruits and vegetables
    ('GR', 'Grains'),     # Bread, rice, pasta, etc.
    ('DR', 'Dairy'),      # Milk, cheese, yogurt, etc.
    ('MS', 'Meat/Seafood'), # Chicken, beef, fish, etc.
    ('DM', 'Deli Meats'), # Sliced meats
    ('PF', 'Prepared Foods'), # Frozen meals, cooked dishes, leftovers, etc.
    ('BE', 'Beverages'), # Juice, soda, water, etc.
    ('CO', 'Condiments'), # Ketchup, mustard, etc.
    ('EG', 'Eggs'), # Eggs
    ('OT', 'Other'), # Anything else
]

class Fridge(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='fridge',
        primary_key=True
    )

    def __str__(self):
        return f"Fridge of {self.user.username}"

class FridgeItem(models.Model):
    fridge = models.ForeignKey(Fridge, on_delete=models.CASCADE, related_name='items', null=True)
    name = models.CharField(max_length=255)
    quantity = models.IntegerField()
    expiration_date = models.DateField()
    category = models.CharField(max_length=2, choices=CATEGORY_CHOICES, default='PL')   # default to 'Please Select'
    date_added = models.DateTimeField(default=timezone.now)
    is_expired = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    def check_expiration(self):
        if self.expiration_date < timezone.now().date():
            self.is_expired = True
            self.save()
        else:
            self.is_expired = False

    def __str__(self):
        return self.name
    
    # Add verbose names for better readability in admin interface
    class Meta:
        verbose_name = "Fridge Item"
        verbose_name_plural = "Fridge Inventory"
