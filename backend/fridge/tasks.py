from celery import shared_task

@shared_task
def check_fridge_expiration():

    # This is where you'd write the logic for checking expired items in the fridge
    print("Checking fridge items for expiration...")
    # Your task logic here
