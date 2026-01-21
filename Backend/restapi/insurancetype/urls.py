from django.urls import path
from .views import InsuranceTypeAPI

urlpatterns = [
    path('insurancetype/', InsuranceTypeAPI.as_view(), name='insurancetype-list'),
    path('insurancetype/<int:id>/', InsuranceTypeAPI.as_view(), name='insurancetype-detail'),
]
