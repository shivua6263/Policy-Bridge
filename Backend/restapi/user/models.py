from django.db import models
from django.contrib.auth.hashers import make_password

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=10)
    address = models.TextField(blank=True)
    password = models.CharField(max_length=255, blank=True, null=True)
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