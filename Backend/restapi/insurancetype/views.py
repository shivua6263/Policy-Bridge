from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import InsuranceType
from .serializers import InsuranceTypeSerializer
# Create your views here.

class InsuranceTypeAPI(APIView):
    
    def post(self,request):
        serializer=InsuranceTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request,id=None):
        if id:
            try:
                user = InsuranceType.objects.get(id=id)
            except InsuranceType.DoesNotExist:
                return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
            serializer = InsuranceTypeSerializer(user)
            return Response(serializer.data) 
        users = InsuranceType.objects.all()
        serializer = InsuranceTypeSerializer(users,many = True)
        return Response(serializer.data)
    
    def put(self, request, id):
        try:
            user = InsuranceType.objects.get(id=id)
        except InsuranceType.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = InsuranceTypeSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            user = InsuranceType.objects.get(id=id)
            user.delete() 
            return Response(status=status.HTTP_204_NO_CONTENT)
        except InsuranceType.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

