from rest_framework import serializers
from .models import SupportTicket, SupportResponse

class SupportTicketSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)

    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_id', 'customer', 'customer_name', 'customer_email',
            'subject', 'priority', 'status', 'first_name', 'last_name',
            'email', 'phone', 'message', 'attachments', 'created_at',
            'updated_at', 'resolved_at'
        ]
        read_only_fields = ['id', 'ticket_id', 'created_at', 'updated_at', 'resolved_at']

class SupportTicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = [
            'customer', 'subject', 'priority', 'first_name', 'last_name',
            'email', 'phone', 'message', 'attachments'
        ]

    def create(self, validated_data):
        # Set default status and customer if not provided
        if 'status' not in validated_data:
            validated_data['status'] = 'open'
        return super().create(validated_data)

class SupportResponseSerializer(serializers.ModelSerializer):
    responder_name = serializers.CharField(source='responder.get_full_name', read_only=True)
    responder_username = serializers.CharField(source='responder.username', read_only=True)

    class Meta:
        model = SupportResponse
        fields = [
            'id', 'ticket', 'responder', 'responder_name', 'responder_username',
            'message', 'is_internal', 'attachments', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']