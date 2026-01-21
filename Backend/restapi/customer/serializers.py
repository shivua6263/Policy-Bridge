from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'email', 'password', 'phone_number', 'profile_image', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        """Hash password when creating customer"""
        password = validated_data.pop('password', None)
        customer = Customer(**validated_data)
        if password:
            customer.set_password(password)
        customer.save()
        return customer
    
    def update(self, instance, validated_data):
        """Hash password when updating customer"""
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class CustomerSignupSerializer(serializers.ModelSerializer):
    """Serializer for customer signup"""
    class Meta:
        model = Customer
        fields = ['name', 'email', 'password', 'phone_number']
    
    def create(self, validated_data):
        """Hash password when creating customer"""
        password = validated_data.pop('password', None)
        customer = Customer(**validated_data)
        if password:
            customer.set_password(password)
        customer.save()
        return customer


class CustomerLoginSerializer(serializers.Serializer):
    """Serializer for customer login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)