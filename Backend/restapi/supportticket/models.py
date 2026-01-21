from django.db import models
from django.contrib.auth.models import User
from customer.models import Customer

class SupportTicket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    SUBJECT_CHOICES = [
        ('policy', 'Policy Related'),
        ('claims', 'Claims Assistance'),
        ('billing', 'Billing & Payments'),
        ('technical', 'Technical Issues'),
        ('account', 'Account Management'),
        ('other', 'Other'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='support_tickets')
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='open')

    # Contact information
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True)

    # Ticket details
    message = models.TextField()
    attachments = models.JSONField(default=list, blank=True)  # Store file paths/URLs

    # Metadata
    ticket_id = models.CharField(max_length=20, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.ticket_id:
            # Generate ticket ID: TICK-YYYYMMDD-XXXX
            import datetime
            today = datetime.date.today().strftime('%Y%m%d')
            import random
            random_num = str(random.randint(1000, 9999))
            self.ticket_id = f'TICK-{today}-{random_num}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket_id} - {self.subject} ({self.status})"

    class Meta:
        ordering = ['-created_at']


class SupportResponse(models.Model):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='responses')
    responder = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    is_internal = models.BooleanField(default=False)  # Internal notes vs customer-visible responses
    attachments = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response to {self.ticket.ticket_id} by {self.responder.username}"

    class Meta:
        ordering = ['created_at']