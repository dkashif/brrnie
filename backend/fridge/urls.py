from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FridgeItemViewSet

router = DefaultRouter()
router.register(r"inventory", FridgeItemViewSet, basename="fridgeitem")

urlpatterns = [
    path("", include(router.urls)),
]
