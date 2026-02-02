from django.db import models
from django.conf import settings
import uuid

# Create your models here.

def project_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/projects/<project_id>/<filename>
    return f'uploads/{instance.user.id}/{instance.id}{filename}'

class Project(models.Model):
    SOURCE_CHOICES = [
        ('github', 'GitHub Repository'),
        ('zip', 'ZIP Upload'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
        
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects'
    ) 
    name = models.CharField(max_length=255)
    source_type = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    zip_file = models.FileField(upload_to=project_directory_path, blank=True, null=True)
    repo_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name