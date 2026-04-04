from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.utils import timezone
from .models import Scan, Project
from .serializers import ScanSerializer
from projects.utils.zip_validator import validate_zip
from .services.scanner_runner import ScannerRunner
import tempfile
import zipfile
import shutil
import os

class ScanListView(ListAPIView):
    queryset = Scan.objects.all().order_by('-started_at')
    serializer_class = ScanSerializer

class ScanDetailView(RetrieveAPIView):
    queryset = Scan.objects.all()
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
                # Perform the scan validation
                validation_result = validate_zip(project.zip_file.path)
                
                # Extract the zip file to run the actual security scanners
                scan_results = {}
                extract_dir = tempfile.mkdtemp()
                try:
                    with zipfile.ZipFile(project.zip_file.path, 'r') as zip_ref:
                        zip_ref.extractall(extract_dir)
                    
                    # Run selected scanners
                    runner = ScannerRunner(extract_dir, scanners)
                    scan_results = runner.run_all()
                finally:
                    # Clean up temporary directory
                    shutil.rmtree(extract_dir, ignore_errors=True)

                # Update with results
                scan.result = {
                    'validation': validation_result,
                    'scans': scan_results
                }
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

class ResolveScanView(APIView):
    def patch(self, request, pk):
        scan = get_object_or_404(Scan, pk=pk)
        scan.status = 'resolved'
        scan.save()
        serializer = ScanSerializer(scan)
        return Response(serializer.data)

class DismissFindingView(APIView):
    def post(self, request, pk):
        scan = get_object_or_404(Scan, pk=pk)
        finding_id = request.data.get('finding_id')
        
        if not finding_id:
            return Response({'error': 'finding_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if finding_id not in scan.dismissed_findings:
            scan.dismissed_findings.append(finding_id)
            scan.save()
            
        return Response({'success': True, 'dismissed_findings': scan.dismissed_findings})

    def delete(self, request, pk):
        scan = get_object_or_404(Scan, pk=pk)
        finding_id = request.data.get('finding_id')
        
        if not finding_id:
            return Response({'error': 'finding_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        if finding_id in scan.dismissed_findings:
            scan.dismissed_findings.remove(finding_id)
            scan.save()
            
        return Response({'success': True, 'dismissed_findings': scan.dismissed_findings})
