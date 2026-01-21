from django.urls import path
from .views import CustomerPolicyAPI

urlpatterns = [
    path('customerpolicy/', CustomerPolicyAPI.as_view(), name='customerpolicy-list'),
    path('customerpolicy/<int:id>/', CustomerPolicyAPI.as_view(), name='customerpolicy-detail'),
]
