from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Fridge
from django.conf import settings
from accounts.models import UserProfile

@receiver(post_save, sender=User)
def create_user_fridge(sender, instance, created, **kwargs):
    if created:
        Fridge.objects.create(user=instance)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        UserProfile.objects.get_or_create(user=instance)
