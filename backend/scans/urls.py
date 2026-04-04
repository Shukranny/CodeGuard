from .views import StartScanView, ScanListView, ScanDetailView, ResolveScanView, DismissFindingView
from django.urls import path

urlpatterns = [
    path('', ScanListView.as_view(), name='scan-list'),
    path('start/', StartScanView.as_view(), name='start-scan'),
    path('<int:pk>/', ScanDetailView.as_view(), name='scan-detail'),
    path('<int:pk>/resolve/', ResolveScanView.as_view(), name='scan-resolve'),
    path('<int:pk>/dismiss/', DismissFindingView.as_view(), name='scan-dismiss'),
]
