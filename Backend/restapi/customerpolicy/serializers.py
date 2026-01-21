from rest_framework import serializers
from .models import CustomerPolicy


class CustomerPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerPolicy
        fields = '__all__'