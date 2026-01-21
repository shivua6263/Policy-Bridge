from django.db import models
from user.models import User

# Create your models here.
class Plan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan_name = models.CharField(max_length=255)
    plan_description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.plan_name