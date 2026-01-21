from django.urls import path
from .views import InsuranceCompanyAPI

urlpatterns = [
    path('insurancecompany/', InsuranceCompanyAPI.as_view(), name='insurancecompany-list'),
    path('insurancecompany/<int:id>/', InsuranceCompanyAPI.as_view(), name='insurancecompany-detail'),
]
