from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import ZipUploadView, ProjectListView, ProjectValidationView,ValidateProjectView

urlpatterns = [
    path('upload/', ZipUploadView.as_view(), name='zip-upload'),
    path('', ProjectListView.as_view(), name='project-list'),
    path('<uuid:project_id>/validate/', ValidateProjectView.as_view(), name='project-validate')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

