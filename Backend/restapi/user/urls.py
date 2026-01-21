from django.urls import path
from user.views import (
    UserAPI, UserLoginAPI, ForgotPasswordPhoneAPI,
    ForgotPasswordVerifyOTPAPI, ForgotPasswordResetAPI, RegisterTelegramChatIDAPI
)

urlpatterns = [
    path('user/', UserAPI.as_view(), name='user-list'),
    path('user/<int:id>/', UserAPI.as_view(), name='user-detail'),
    path('login/', UserLoginAPI.as_view(), name='user-login'),
    path('forgot-password/phone/', ForgotPasswordPhoneAPI.as_view(), name='forgot-password-phone'),
    path('forgot-password/verify-otp/', ForgotPasswordVerifyOTPAPI.as_view(), name='forgot-password-verify-otp'),
    path('forgot-password/reset/', ForgotPasswordResetAPI.as_view(), name='forgot-password-reset'),
    path('telegram/register-chat-id/', RegisterTelegramChatIDAPI.as_view(), name='register-telegram-chat-id'),
]
