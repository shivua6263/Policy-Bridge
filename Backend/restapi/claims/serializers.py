from rest_framework import serializers
from .models import Claim
from customerpolicy.models import CustomerPolicy

class ClaimSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    policy_name = serializers.CharField(source='customer_policy.policy.policy_name', read_only=True)
    insurance_company = serializers.CharField(source='customer_policy.policy.insurance_company.name', read_only=True)
    insurance_type = serializers.CharField(source='customer_policy.policy.insurance_type.name', read_only=True)

    class Meta:
        model = Claim
        fields = [
            'id', 'customer', 'customer_policy', 'claim_type', 'incident_date',
            'claim_amount', 'approved_amount', 'incident_location', 'description',
            'status', 'submitted_at', 'updated_at', 'processed_at', 'remarks',
            'supporting_documents', 'customer_name', 'customer_email',
            'policy_name', 'insurance_company', 'insurance_type'
        ]
        read_only_fields = ['id', 'submitted_at', 'updated_at', 'processed_at', 'approved_amount']

class ClaimCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Claim
        fields = [
            'customer_policy', 'claim_type', 'incident_date', 'claim_amount',
            'incident_location', 'description', 'supporting_documents'
        ]

    def validate_claim_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Claim amount must be greater than zero.")
        return value

    def validate(self, data):
        customer_policy = data.get('customer_policy')
        if customer_policy.status != 'active':
            raise serializers.ValidationError("Cannot file claim for inactive or expired policy.")
        return data