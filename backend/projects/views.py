from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Project
from rest_framework.generics import ListAPIView
from .serializers import ZipUploadSerializer, ProjectListSerializer
from .utils.zip_validator import validate_zip
import zipfile
import os
import re
import json
import urllib.request
import urllib.error
import urllib.parse
from django.core.files.base import ContentFile
from django.conf import settings

LANGUAGE_EXTENSIONS = {
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".py": "Python",
    ".java": "Java",
    ".php": "PHP",
    ".html": "HTML",
    ".css": "CSS",
    ".cpp": "C++",
    ".c": "C",
}


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

class GitHubUploadView(APIView):
    def post(self, request):
        url = request.data.get('url')
        token = request.data.get('token')
        
        if not url:
            return Response({'error': 'URL is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract owner and repo
        match = re.match(r'https?://github\.com/([^/]+)/([^/.]+)(?:\.git)?/?', url)
        if not match:
            return Response({'error': 'Invalid GitHub URL'}, status=status.HTTP_400_BAD_REQUEST)
            
        owner, repo = match.groups()
        
        # Get default branch
        api_url = f'https://api.github.com/repos/{owner}/{repo}'
        headers = {'Accept': 'application/vnd.github.v3+json'}
        if token:
            headers['Authorization'] = f'token {token}'
            
        try:
            req = urllib.request.Request(api_url, headers=headers)
            with urllib.request.urlopen(req) as response:
                repo_data = json.loads(response.read().decode())
                default_branch = repo_data.get('default_branch', 'main')
        except urllib.error.HTTPError as e:
            return Response({'error': f'Failed to fetch repository metadata: {e.reason}'}, status=e.code)
        except Exception as e:
            return Response({'error': f'Failed to fetch repository metadata: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        # Download zipball
        zip_url = f'https://api.github.com/repos/{owner}/{repo}/zipball/{default_branch}'
        try:
            req = urllib.request.Request(zip_url, headers=headers)
            with urllib.request.urlopen(req) as response:
                zip_content = response.read()
                
            project = Project.objects.create(
                name=f'{owner}_{repo}.zip',
            )
            project.zip_file.save(f'{owner}_{repo}.zip', ContentFile(zip_content))
            return Response(
                { 
                    'id': str(project.id), 
                    'name': project.name, 
                    'zip_file': project.zip_file.url if project.zip_file else None, 
                    'created_at': project.created_at
                }, 
                status=status.HTTP_201_CREATED
            )
        except urllib.error.HTTPError as e:
            return Response({'error': f'Failed to download repository: {e.reason}'}, status=e.code)
        except Exception as e:
            return Response({'error': f'Failed to download repository: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
class ProjectListView(ListAPIView):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectListSerializer

class ProjectValidationView(APIView):
    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        validation_data = validate_zip(project.zip_file.path)
        return Response(validation_data, status=status.HTTP_200_OK)

class ValidateProjectView(APIView):
    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        zip_path = project.zip_file.path

        languages = set()
        file_count = 0
        total_size = 0

        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                for file_info in zip_ref.infolist():
                    if not file_info.is_dir():
                        file_count += 1
                        total_size += file_info.file_size

                        _, ext = os.path.splitext(file_info.filename)
                        ext = ext.lower()

                        if ext in LANGUAGE_EXTENSIONS:
                            languages.add(LANGUAGE_EXTENSIONS[ext])

        except zipfile.BadZipFile:
            return Response(
                {
                    "isValid": False,
                    "languages": [],
                    "fileCount": 0,
                    "totalSize": 0,
                    "errors": [
                        {
                            "title": "Invalid ZIP",
                            "message": "Uploaded file is not a valid ZIP archive."
                        }
                    ],
                    "warnings": []
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            "isValid": True,
            "languages": list(languages),
            "fileCount": file_count,
            "totalSize": total_size,
            "errors": [],
            "warnings": []
        })
