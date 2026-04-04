from rest_framework import serializers
from .models import Scan

class ScanSerializer(serializers.ModelSerializer):
    project_name = serializers.ReadOnlyField(source='project.name')

    class Meta:
        model = Scan
        fields = [
            'id',
            'project',
            'project_name',
            'scanners',
            'result',
            'status',
            'dismissed_findings',
            'started_at',
            'completed_at'
        ]

        read_only_fields = [
            'started_at',
            'completed_at'
        ]