from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Claim
from .serializers import ClaimSerializer, ClaimCreateSerializer
from customer.models import Customer

class ClaimViewSet(viewsets.ModelViewSet):
    queryset = Claim.objects.all()
    # Temporarily remove authentication for testing
    # permission_classes = [IsAuthenticated]
    serializer_class = ClaimSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return ClaimCreateSerializer
        return ClaimSerializer

    def get_queryset(self):
        queryset = Claim.objects.all()
        customer_id = self.request.query_params.get('customer', None)
        status_filter = self.request.query_params.get('status', None)

        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset

    def perform_create(self, serializer):
        # Get customer from session/token (assuming customer is authenticated)
        # For now, we'll assume customer ID is passed or extracted from auth
        customer_id = self.request.data.get('customer_id')
        if customer_id:
            customer = get_object_or_404(Customer, id=customer_id)
            claim = serializer.save(customer=customer)
        else:
            claim = serializer.save()

        # Send WebSocket notification
        self.send_claims_update(claim.customer_id)

    def perform_update(self, serializer):
        claim = serializer.save()

        # Send WebSocket notification
        self.send_claims_update(claim.customer_id)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        claim = self.get_object()
        new_status = request.data.get('status')
        approved_amount = request.data.get('approved_amount')
        remarks = request.data.get('remarks')

        if new_status not in dict(Claim.CLAIM_STATUS):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        claim.status = new_status
        if approved_amount is not None:
            claim.approved_amount = approved_amount
        if remarks:
            claim.remarks = remarks

        from django.utils import timezone
        claim.processed_at = timezone.now()
        claim.save()

        # Send WebSocket notification
        self.send_claims_update(claim.customer_id)

        serializer = self.get_serializer(claim)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_claims(self, request):
        """Get claims for the authenticated customer"""
        customer_id = request.query_params.get('customer_id')
        if not customer_id:
            return Response({'error': 'Customer ID required'}, status=status.HTTP_400_BAD_REQUEST)

        claims = self.get_queryset().filter(customer_id=customer_id)
        serializer = self.get_serializer(claims, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get claims statistics"""
        customer_id = request.query_params.get('customer_id')

        if customer_id:
            claims = Claim.objects.filter(customer_id=customer_id)
        else:
            claims = Claim.objects.all()

        total_claims = claims.count()
        pending_claims = claims.filter(status='pending').count()
        approved_claims = claims.filter(status='approved').count()
        rejected_claims = claims.filter(status='rejected').count()
        paid_claims = claims.filter(status='paid').count()

        total_amount = sum(claim.claim_amount for claim in claims)
        approved_amount = sum(claim.approved_amount for claim in claims if claim.approved_amount)

        return Response({
            'total_claims': total_claims,
            'pending_claims': pending_claims,
            'approved_claims': approved_claims,
            'rejected_claims': rejected_claims,
            'paid_claims': paid_claims,
            'total_claim_amount': total_amount,
            'total_approved_amount': approved_amount,
        })

    def send_claims_update(self, customer_id):
        """Send WebSocket notification for claims update"""
        try:
            from .consumers import broadcast_claim_update
            import asyncio
            # Run the async broadcast function in a new event loop
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.run_until_complete(broadcast_claim_update(customer_id))
            loop.close()
        except Exception as e:
            # Log the error but don't fail the request
            print(f"WebSocket notification failed: {e}")
