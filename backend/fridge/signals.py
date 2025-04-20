from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Fridge

from django.contrib.auth.signals import user_logged_in
from .tasks import update_expiration_status

User = get_user_model()

@receiver(post_save, sender=User)
def create_fridge_for_user(sender, instance, created, **kwargs):
    if created:
        Fridge.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_fridge_for_user(sender, instance, **kwargs):
    if hasattr(instance, 'fridge'):
        instance.fridge.save()