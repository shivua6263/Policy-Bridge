from django.urls import path
from .views import PlanAPI

urlpatterns = [
    path('plan/', PlanAPI.as_view(), name='plan-list'),
    path('plan/<int:id>/', PlanAPI.as_view(), name='plan-detail'),
]
