from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Project
from .serializers import ZipUploadSerializer, ProjectListSerializer

# Create your views here.
class ZipUploadView(APIView):
    def post(self, request):
        serializer = ZipUploadSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        project = serializer.save(
            name = request.FILES['zip_file'].name,

        )
        return Response(
            { 'project_id': project.id}, 
            status=status.HTTP_201_CREATED
        )
    
class ProjectListView(APIView):
    def get(self, request):
        projects = Project.objects.all().order_by('-created_at')
        serializer = ProjectListSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)