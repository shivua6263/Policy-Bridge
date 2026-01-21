from django.urls import path
from .views import AgentAPI, AgentSignupAPI, AgentLoginAPI

urlpatterns = [
    path('agent/', AgentAPI.as_view(), name='agent-list'),
    path('agent/<int:id>/', AgentAPI.as_view(), name='agent-detail'),
    path('agent/signup/', AgentSignupAPI.as_view(), name='agent-signup'),
    path('agent/login/', AgentLoginAPI.as_view(), name='agent-login'),
]
