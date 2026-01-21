from rest_framework import serializers
from .models import Agent


class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        """Hash password when creating agent"""
        password = validated_data.pop('password', None)
        agent = Agent(**validated_data)
        if password:
            agent.set_password(password)
        agent.save()
        return agent
    
    def update(self, instance, validated_data):
        """Hash password when updating agent"""
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class AgentSignupSerializer(serializers.ModelSerializer):
    """Serializer for agent signup"""
    class Meta:
        model = Agent
        fields = ['name', 'email', 'password', 'phone_number']
    
    def create(self, validated_data):
        """Hash password when creating agent"""
        password = validated_data.pop('password', None)
        agent = Agent(**validated_data)
        if password:
            agent.set_password(password)
        agent.save()
        return agent


class AgentLoginSerializer(serializers.Serializer):
    """Serializer for agent login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)