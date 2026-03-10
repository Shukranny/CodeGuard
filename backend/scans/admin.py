from django.contrib import admin
from .models import Scan

@admin.register(Scan)
class ScanAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'status', 'started_at', 'completed_at', 'scanners')
    list_filter = ('status',)
    search_fields = ('project__name',)
