from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import base64
import os
from django.conf import settings

from .models import Customer
from .serializers import CustomerSerializer, CustomerSignupSerializer, CustomerLoginSerializer
# Create your views here.

class CustomerAPI(APIView):
    
    def post(self,request):
        serializer=CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request,id=None):
        if id:
            try:
                user = Customer.objects.get(id=id)
            except Customer.DoesNotExist:
                return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
            serializer = CustomerSerializer(user)
            return Response(serializer.data) 
        users = Customer.objects.all()
        serializer = CustomerSerializer(users,many = True)
        return Response(serializer.data)
    
    def put(self, request, id):
        try:
            user = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CustomerSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            user = Customer.objects.get(id=id)
            user.delete() 
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Customer.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)


class CustomerSignupAPI(APIView):
    """API endpoint for customer signup"""
    
    def post(self, request):
        serializer = CustomerSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Customer registered successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerLoginAPI(APIView):
    """API endpoint for customer login"""
    
    def post(self, request):
        serializer = CustomerLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            try:
                customer = Customer.objects.get(email=email)
            except Customer.DoesNotExist:
                return Response(
                    {"message": "Invalid email or password"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Check password
            if customer.check_password(password):
                return Response({
                    "id": customer.id,
                    "name": customer.name, 
                    "email": customer.email,
                    "phone_number": customer.phone_number,
                    "profile_image": customer.profile_image,
                    "message": "Login successful"
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"message": "Invalid email or password"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerProfileImageAPI(APIView):
    """API endpoint for uploading and managing customer profile images"""
    
    def post(self, request, id):
        """Upload profile image as base64"""
        try:
            customer = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            # Get base64 image and file type from request
            image_data = request.data.get('image')
            file_type = request.data.get('fileType', 'png')
            
            if not image_data:
                return Response({"error": "No image data provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate file type
            if file_type not in ['png', 'jpg', 'jpeg']:
                return Response({"error": "Only PNG and JPG/JPEG formats are allowed"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create media directory if it doesn't exist
            media_dir = os.path.join(settings.BASE_DIR, 'media', 'profile_images')
            os.makedirs(media_dir, exist_ok=True)
            
            # Generate filename with username and id
            filename = f"{customer.name.replace(' ', '_')}_{customer.id}.{file_type}"
            file_path = os.path.join(media_dir, filename)
            
            # Remove base64 header if present (data:image/png;base64,)
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            # Decode base64 and save image
            image_binary = base64.b64decode(image_data)
            with open(file_path, 'wb') as f:
                f.write(image_binary)
            
            # Update customer profile image field
            customer.profile_image = filename
            customer.save()
            
            return Response({
                "message": "Profile image uploaded successfully",
                "profile_image": filename,
                "image_url": f"/media/profile_images/{filename}"
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": f"Error uploading image: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, id):
        """Get customer profile image"""
        try:
            customer = Customer.objects.get(id=id)
            if customer.profile_image:
                return Response({
                    "profile_image": customer.profile_image,
                    "image_url": f"/media/profile_images/{customer.profile_image}"
                }, status=status.HTTP_200_OK)
            else:
                return Response({"profile_image": None}, status=status.HTTP_200_OK)
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)
