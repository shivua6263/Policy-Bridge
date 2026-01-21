from django.db import models
from customer.models import Customer
from customerpolicy.models import CustomerPolicy

class Claim(models.Model):
    CLAIM_TYPES = [
        ('health', 'Health Insurance Claim'),
        ('life', 'Life Insurance Claim'),
        ('motor', 'Motor Insurance Claim'),
        ('home', 'Home Insurance Claim'),
        ('travel', 'Travel Insurance Claim'),
        ('property', 'Property Insurance Claim'),
        ('business', 'Business Insurance Claim'),
        ('other', 'Other'),
    ]

    CLAIM_STATUS = [
        ('pending', 'Pending Review'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('paid', 'Paid'),
        ('closed', 'Closed'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='claims')
    customer_policy = models.ForeignKey(CustomerPolicy, on_delete=models.CASCADE, related_name='claims')
    claim_type = models.CharField(max_length=20, choices=CLAIM_TYPES)
    incident_date = models.DateField()
    claim_amount = models.DecimalField(max_digits=15, decimal_places=2)
    approved_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    incident_location = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=CLAIM_STATUS, default='pending')
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    remarks = models.TextField(blank=True, null=True)

    # Document uploads (file paths)
    supporting_documents = models.JSONField(default=list, blank=True)  # Store file paths as JSON array

    def __str__(self):
        return f"Claim #{self.id} - {self.customer.name} - {self.claim_type}"

    class Meta:
        ordering = ['-submitted_at']
