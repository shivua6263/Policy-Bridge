import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Claim
from .serializers import ClaimSerializer

class ClaimConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.customer_id = self.scope['url_route']['kwargs']['customer_id']
        self.room_group_name = f'claims_{self.customer_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Send initial claims data
        await self.send_claims_update()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'refresh':
            await self.send_claims_update()
        elif action == 'filter':
            status_filter = data.get('status')
            await self.send_filtered_data(status_filter)
        elif action == 'ping':
            await self.send(text_data=json.dumps({
                'type': 'pong',
                'timestamp': data.get('timestamp')
            }))

    async def send_claims_update(self):
        claims_data = await self.get_customer_claims()
        await self.send(text_data=json.dumps({
            'type': 'claims_update',
            'claims': claims_data,
            'total_count': len(claims_data)
        }))

    async def send_filtered_data(self, status_filter):
        claims_data = await self.get_customer_claims(status_filter)
        await self.send(text_data=json.dumps({
            'type': 'claims_update',
            'claims': claims_data,
            'total_count': len(claims_data)
        }))

    # Receive message from room group
    async def claims_update(self, event):
        """Send claims update to WebSocket"""
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def get_customer_claims(self, status_filter=None):
        queryset = Claim.objects.filter(customer_id=self.customer_id)

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        claims = queryset.order_by('-submitted_at')
        serializer = ClaimSerializer(claims, many=True)
        return serializer.data


# Function to broadcast claims updates to all connected clients for a customer
async def broadcast_claim_update(customer_id):
    from channels.layers import get_channel_layer
    channel_layer = get_channel_layer()

    @database_sync_to_async
    def get_claims():
        claims = Claim.objects.filter(customer_id=customer_id).order_by('-submitted_at')
        serializer = ClaimSerializer(claims, many=True)
        return serializer.data

    claims_data = await get_claims()

    await channel_layer.group_send(
        f'claims_{customer_id}',
        {
            'type': 'claims_update',
            'claims': claims_data,
            'total_count': len(claims_data)
        }
    )