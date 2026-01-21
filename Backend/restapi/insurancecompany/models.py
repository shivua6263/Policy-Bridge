from django.db import models

# Create your models here.
class InsuranceCompany(models.Model):
    name = models.CharField(max_length=255)
    contact_info = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    website = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name