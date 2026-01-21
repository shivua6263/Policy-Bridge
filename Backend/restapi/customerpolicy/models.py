from django.db import models

from agent.models import Agent
from customer.models import Customer
from policy.models import Policy

# Create your models here.
class CustomerPolicy(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE)
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE)
    subscription_date = models.DateTimeField()
    expiry_date = models.DateTimeField()
    premium_amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('active', 'Active'), ('expired', 'Expired'), ('cancelled', 'Cancelled')])

    def __str__(self):
        return f"{self.customer.name} - {self.policy.policy_name}"