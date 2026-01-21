from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import User
from .serializers import (
    UserSerializer, UserLoginSerializer, ForgotPasswordPhoneSerializer,
    ForgotPasswordOTPSerializer, ResetPasswordSerializer
)
from .password_reset import OTPManager

# Create your views here.

class UserAPI(APIView):
    
    def post(self,request):
        serializer=UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request,id=None):
        if id:
            try:
                user = User.objects.get(id=id)
            except User.DoesNotExist:
                return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
            serializer = UserSerializer(user)
            return Response(serializer.data) 
        users = User.objects.all()
        serializer = UserSerializer(users,many = True)
        return Response(serializer.data)
    
    def put(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
            user.delete() 
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)


class UserLoginAPI(APIView):
    """API endpoint for user login"""
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"message": "Invalid email or password"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Check password
            if user.check_password(password):
                return Response({
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "message": "Login successful"
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"message": "Invalid email or password"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordPhoneAPI(APIView):
    """Verify phone number and send OTP"""
    
    def post(self, request):
        serializer = ForgotPasswordPhoneSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            
            # Check if user with this phone exists
            try:
                user = User.objects.get(phone=phone)
            except User.DoesNotExist:
                return Response(
                    {"message": "Phone number not found in our system"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Generate OTP
            otp = OTPManager.generate_otp()
            OTPManager.save_otp(phone, otp)
            
            # Send OTP via Telegram
            success, msg = OTPManager.send_otp_via_telegram(phone, user.name, otp)
            
            if success:
                return Response({
                    "message": "OTP sent to your Telegram. Check your messages.",
                    "phone": phone
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"message": msg},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordVerifyOTPAPI(APIView):
    """Verify OTP"""
    
    def post(self, request):
        serializer = ForgotPasswordOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            otp = serializer.validated_data['otp']
            
            # Verify OTP
            is_valid, msg = OTPManager.verify_otp(phone, otp)
            
            if is_valid:
                return Response({
                    "message": "OTP verified. You can now reset your password.",
                    "phone": phone
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"message": msg},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordResetAPI(APIView):
    """Reset password after OTP verification"""
    
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            new_password = serializer.validated_data['new_password']
            
            # Check if phone number is verified
            try:
                user = User.objects.get(phone=phone)
            except User.DoesNotExist:
                return Response(
                    {"message": "User not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Update password
            user.set_password(new_password)
            user.save()
            
            return Response({
                "message": "Password reset successfully. You can now login with your new password.",
                "email": user.email
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterTelegramChatIDAPI(APIView):
    """Register Telegram chat ID for a phone number"""
    
    def post(self, request):
        from django.core.cache import cache
        phone = request.data.get('phone')
        telegram_chat_id = request.data.get('telegram_chat_id')
        
        if not phone or not telegram_chat_id:
            return Response(
                {"message": "Phone and telegram_chat_id are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify phone number exists
        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response(
                {"message": "User with this phone number not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Store telegram chat ID in cache
        cache.set(f'telegram_chat_id_{phone}', telegram_chat_id, timeout=None)
        
        return Response({
            "message": "Telegram chat ID registered successfully",
            "phone": phone,
            "telegram_chat_id": telegram_chat_id
        }, status=status.HTTP_200_OK)
