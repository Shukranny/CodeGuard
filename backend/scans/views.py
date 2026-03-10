from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from django.utils import timezone
from .models import Scan, Project
from .serializers import ScanSerializer
from projects.utils.zip_validator import validate_zip

class ScanListView(ListAPIView):
    queryset = Scan.objects.all().order_by('-started_at')
    serializer_class = ScanSerializer

class StartScanView(APIView):
    def post(self, request):
        project_id = request.data.get('project_id')
        scanners = request.data.get("selected_scanners", [])
        
        try:
            project = Project.objects.get(id=project_id)
            # Create initial scan record
            scan = Scan.objects.create(
                project=project,
                scanners=scanners,
                status='running',
                started_at=timezone.now()
            )
            
            try:
                # Perform the scan (currently just validation)
                validation_result = validate_zip(project.zip_file.path)
                
                # Update with results
                scan.result = validation_result
                scan.status = 'completed'
                scan.completed_at = timezone.now()
                scan.save()
                
                serializer = ScanSerializer(scan)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                scan.status = 'failed'
                scan.result = {'error': str(e)}
                scan.completed_at = timezone.now()
                scan.save()
                return Response({'error': f'Scan failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
