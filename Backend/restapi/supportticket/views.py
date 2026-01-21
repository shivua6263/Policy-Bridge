from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import SupportTicket, SupportResponse
from .serializers import (
    SupportTicketSerializer,
    SupportTicketCreateSerializer,
    SupportResponseSerializer
)

class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return SupportTicketCreateSerializer
        return SupportTicketSerializer

    def get_queryset(self):
        queryset = SupportTicket.objects.all()
        customer_id = self.request.query_params.get('customer', None)
        status_filter = self.request.query_params.get('status', None)
        subject_filter = self.request.query_params.get('subject', None)

        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if subject_filter:
            queryset = queryset.filter(subject=subject_filter)

        return queryset

    @action(detail=True, methods=['post'])
    def add_response(self, request, pk=None):
        """Add a response to a support ticket"""
        ticket = self.get_object()
        serializer = SupportResponseSerializer(data={
            **request.data,
            'ticket': ticket.id,
            'responder': request.user.id
        })

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update ticket status"""
        ticket = self.get_object()
        new_status = request.data.get('status')

        if new_status not in dict(SupportTicket.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        ticket.status = new_status
        if new_status in ['resolved', 'closed']:
            from django.utils import timezone
            ticket.resolved_at = timezone.now()
        ticket.save()

        serializer = self.get_serializer(ticket)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_tickets(self, request):
        """Get tickets for the current user (if customer)"""
        # This would need to be adjusted based on your authentication system
        # For now, return all tickets
        tickets = self.get_queryset()
        serializer = self.get_serializer(tickets, many=True)
        return Response(serializer.data)

class SupportResponseViewSet(viewsets.ModelViewSet):
    queryset = SupportResponse.objects.all()
    serializer_class = SupportResponseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = SupportResponse.objects.all()
        ticket_id = self.request.query_params.get('ticket', None)

        if ticket_id:
            queryset = queryset.filter(ticket_id=ticket_id)

        return queryset