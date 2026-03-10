from django.db import models
from django.utils import timezone
from projects.models import Project

# Create your models here.
class Scan(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ]
    project = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE
    )
    scanners = models.JSONField(
        default=list,
        blank=True
    )
    result = models.JSONField(
        null=True,
        blank=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    started_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Scan {self.id} - {self.project.name}"
    
    
