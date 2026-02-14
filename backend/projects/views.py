from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Project
from rest_framework.generics import ListAPIView
from .serializers import ZipUploadSerializer, ProjectListSerializer

# Create your views here.
class ZipUploadView(APIView):
    def post(self, request):
        serializer = ZipUploadSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        zip_file = serializer.validated_data['file']

        project = Project.objects.create(
            name=zip_file.name, 
            zip_file=zip_file

        )
        return Response(
            { 
                'id': project.id, 
                'name': project.name, 
                'zip_file': project.zip_file.url, 
                'created_at': project.created_at
            }, 
            status=status.HTTP_201_CREATED
        )
    
class ProjectListView(ListAPIView):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectListSerializer