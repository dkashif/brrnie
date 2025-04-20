from celery import shared_task
from .models import FridgeItem
from django.core.mail import send_mail
from datetime import date
from django.utils import timezone
from django.conf import settings
from accounts.models import UserProfile

@shared_task
def update_expiration_status():
    today = date.today()
    updated_count = 0

    items = FridgeItem.objects.filter(expiration_date__lt=today, is_expired=False)

    for item in items:
        item.is_expired = True
        item.save()
        updated_count += 1

    return f"Updated {updated_count} items to expired status."

@shared_task
def check_and_send_expiration_notifications():
    today = timezone.now().date()
    user_profiles = UserProfile.objects.select_related("user").filter(receive_expiration_reminders=True)

    for profile in user_profiles:
        user = profile.user
        days_before = profile.days_before_expiration

        upcoming_items = FridgeItem.objects.filter(
            fridge__user=user,
            is_expired=False,
            expiration_date__range=(today + timezone.timedelta(days=1), today + timezone.timedelta(days=days_before))
        )

        if not upcoming_items.exists():
            continue

        message_lines = [
            f"Dear {user.username},\n\nThese items are expiring within the next {days_before} day(s):\n"
        ]

        for item in upcoming_items:
            days_left = (item.expiration_date - today).days
            message_lines.append(f"- {item.name}: in {days_left} day(s) (on {item.expiration_date})")

        message_lines.append("\nPlease check your fridge.\n\nBest regards,\nYour Fridge App Team")

        send_mail(
            subject="Upcoming Expiration Reminder",
            message="\n".join(message_lines),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email]
        )

        print(f"Notification sent to {user.username} about items expiring soon.")