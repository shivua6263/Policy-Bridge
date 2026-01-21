from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'support-tickets', views.SupportTicketViewSet)
router.register(r'support-responses', views.SupportResponseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]