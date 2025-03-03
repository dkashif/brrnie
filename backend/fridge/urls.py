from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FridgeItemViewSet

router = DefaultRouter()
router.register(r'fridge-items', FridgeItemViewSet)    # # Define the URL for fridge-items

urlpatterns = [
    path('api/', include(router.urls)),
]

