from .views import StartScanView, ScanListView, ScanDetailView
from django.urls import path

urlpatterns = [
    path('', ScanListView.as_view(), name='scan-list'),
    path('start/', StartScanView.as_view(), name='start-scan'),
    path('<int:pk>/', ScanDetailView.as_view(), name='scan-detail'),
]
