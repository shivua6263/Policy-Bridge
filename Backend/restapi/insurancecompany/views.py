from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import InsuranceCompany
from .serializers import InsuranceCompanySerializer
# Create your views here.

class InsuranceCompanyAPI(APIView):
    
    def post(self,request):
        serializer=InsuranceCompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request,id=None):
        if id:
            try:
                user = InsuranceCompany.objects.get(id=id)
            except InsuranceCompany.DoesNotExist:
                return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
            serializer = InsuranceCompanySerializer(user)
            return Response(serializer.data) 
        users = InsuranceCompany.objects.all()
        serializer = InsuranceCompanySerializer(users,many = True)
        return Response(serializer.data)
    
    def put(self, request, id):
        try:
            user = InsuranceCompany.objects.get(id=id)
        except InsuranceCompany.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = InsuranceCompanySerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            user = InsuranceCompany.objects.get(id=id)
            user.delete() 
            return Response(status=status.HTTP_204_NO_CONTENT)
        except InsuranceCompany.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

