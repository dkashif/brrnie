from django.db import models
from django.conf import settings

DAYS_BEFORE_CHOICES = [
    (1, '1 day before'),
    (3, '3 days before'),
    (5, '5 days before'),
]

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    notification_frequency = models.CharField(
        max_length=20,
        choices=[('daily', 'Daily'), ('weekly', 'Weekly')],
        default='weekly'
    )

    receive_expiration_reminders = models.BooleanField(
        default=True,
        help_text="Choose whether to receive reminders when items are close to expiring"
    )

    days_before_expiration = models.IntegerField(
        choices=DAYS_BEFORE_CHOICES,
        default=1,
        help_text="How many days before expiration would you like to be notified?"
    )

    def __str__(self):
        return f"{self.user.username}'s profile"