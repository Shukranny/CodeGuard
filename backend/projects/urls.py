from django.urls import path
from .views import ZipUploadView, ProjectListView

urlpatterns = [
    path('upload/', ZipUploadView.as_view(), name='zip-upload'),
    path('projects/', ProjectListView.as_view(), name='project-list'),
]