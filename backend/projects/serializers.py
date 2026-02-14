from rest_framework import serializers
from .models import Project

class ZipUploadSerializer(serializers.Serializer):
    """
    Used ONLY for uploading ZIP files.
    Accepts multipart/form-data with a `file` field.
    """
    file = serializers.FileField()

    def validate_zip_file(self, value):
        if not value.name.endswith('.zip'):
            raise serializers.ValidationError('Only ZIP files are allowed.')

        if value.size > 100 * 1024 * 1024:  # Limit file size to 100MB
            raise serializers.ValidationError('File size must be under 100MB.')
        return value

class ProjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'zip_file', 'created_at']
        