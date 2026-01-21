from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Agent
from .serializers import AgentSerializer, AgentSignupSerializer, AgentLoginSerializer
# Create your views here.

class AgentAPI(APIView):
    
    def post(self,request):
        serializer=AgentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request,id=None):
        if id:
            try:
                user = Agent.objects.get(id=id)
            except Agent.DoesNotExist:
                return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
            serializer = AgentSerializer(user)
            return Response(serializer.data) 
        users = Agent.objects.all()
        serializer = AgentSerializer(users,many = True)
        return Response(serializer.data)
    
    def put(self, request, id):
        try:
            user = Agent.objects.get(id=id)
        except Agent.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AgentSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            user = Agent.objects.get(id=id)
            user.delete() 
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Agent.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)


class AgentSignupAPI(APIView):
    """API endpoint for agent signup"""
    
    def post(self, request):
        serializer = AgentSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Agent registered successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AgentLoginAPI(APIView):
    """API endpoint for agent login"""
    
    def post(self, request):
        serializer = AgentLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            try:
                agent = Agent.objects.get(email=email)
            except Agent.DoesNotExist:
                return Response(
                    {"message": "Invalid email or password"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Check password
            if agent.check_password(password):
                return Response({
                    "id": agent.id,
                    "name": agent.name,
                    "email": agent.email,
                    "phone_number": agent.phone_number,
                    "referral_code": agent.referral_code,
                    "message": "Login successful"
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"message": "Invalid email or password"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
