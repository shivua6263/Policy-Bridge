from django.db import models
from django.contrib.auth.hashers import make_password

# Create your models here.
class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, unique=True)
    profile_image = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    def set_password(self, raw_password):
        """Hash password before saving"""
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Check if provided password matches hashed password"""
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)
