from django.db import models
import uuid
from django.utils import timezone

# Create your models here.
class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    zip_file = models.FileField(upload_to='uploads/')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name