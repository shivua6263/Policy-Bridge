from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone', 'address', 'password', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True} 
        }
    
    def create(self, validated_data):
        """Hash password when creating user"""
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        """Hash password when updating user"""
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class UserLoginSerializer(serializers.Serializer):
    """Serializer for login endpoint"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ForgotPasswordPhoneSerializer(serializers.Serializer):
    """Verify phone number and request OTP"""
    phone = serializers.CharField(max_length=15)


class ForgotPasswordOTPSerializer(serializers.Serializer):
    """Verify OTP"""
    phone = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6)


class ResetPasswordSerializer(serializers.Serializer):
    """Reset password after OTP verification"""
    phone = serializers.CharField(max_length=15)
    new_password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)
    
    def validate(self, data):
        """Verify passwords match"""
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data
