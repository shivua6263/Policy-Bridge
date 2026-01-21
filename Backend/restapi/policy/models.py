from django.db import models
from insurancecompany.models import InsuranceCompany
from insurancetype.models import InsuranceType

# Create your models here.
class Policy(models.Model):
    insurance_type = models.ForeignKey(InsuranceType, on_delete=models.CASCADE)
    insurance_company = models.ForeignKey(InsuranceCompany, on_delete=models.CASCADE)
    policy_name = models.CharField(max_length=255)
    policy_details = models.TextField()
    coverage = models.DecimalField(max_digits=15, decimal_places=2)
    premium_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.policy_name