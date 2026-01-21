from django.urls import path
from .views import PolicyAPI

urlpatterns = [
    path('policy/', PolicyAPI.as_view(), name='policy-list'),
    path('policy/<int:id>/', PolicyAPI.as_view(), name='policy-detail'),
]
