from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FridgeItemViewSetMyVersion

router = DefaultRouter()
router.register(r'inventory', FridgeItemViewSetMyVersion, basename='fridgeitem')

urlpatterns = [
    path('', include(router.urls)),
]

