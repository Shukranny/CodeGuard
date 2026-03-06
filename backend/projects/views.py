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
from django.conf import settings
import requests
from django.core.files.base import ContentFile
import urllib.parse

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

class GitHubImportView(APIView):
    def post(self, request):
        url = request.data.get('url')
        token = request.data.get('token')

        if not url:
            return Response({"error": "Repository URL is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Parse the GitHub URL to get the owner and repo
        try:
            path_parts = urllib.parse.urlparse(url).path.strip('/').split('/')
            if len(path_parts) >= 2:
                owner, repo = path_parts[0], path_parts[1]
                if repo.endswith('.git'):
                    repo = repo[:-4]
            else:
                return Response({"error": "Invalid GitHub URL format. Expected: https://github.com/owner/repo"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"error": "Invalid GitHub URL"}, status=status.HTTP_400_BAD_REQUEST)

        api_url = f"https://api.github.com/repos/{owner}/{repo}/zipball"
        headers = {}
        if token:
            headers['Authorization'] = f"token {token}"

        try:
            response = requests.get(api_url, headers=headers, stream=True)
            if response.status_code == 404:
                return Response({"error": "Repository not found. It might be private or misspelled."}, status=status.HTTP_404_NOT_FOUND)
            elif response.status_code != 200:
                return Response({"error": f"Failed to fetch repository from GitHub. Status code: {response.status_code}"}, status=status.HTTP_400_BAD_REQUEST)

            file_content = response.content
            file_name = f"{owner}-{repo}.zip"

            project = Project.objects.create(name=file_name)
            project.zip_file.save(file_name, ContentFile(file_content))
            
            return Response(
                { 
                    'id': project.id, 
                    'name': project.name, 
                    'zip_file': project.zip_file.url, 
                    'created_at': project.created_at
                }, 
                status=status.HTTP_201_CREATED
            )

        except requests.exceptions.RequestException as e:
            return Response({"error": f"Error communicating with GitHub: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
