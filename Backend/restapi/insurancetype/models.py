from django.db import models

# Create your models here.
class InsuranceType(models.Model):
    type_name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.type_name