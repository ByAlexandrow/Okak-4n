from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, analyze_project_complexity, submit_request

router = DefaultRouter()
router.register(r'', ProjectViewSet)

urlpatterns = [
    path('analyze/', analyze_project_complexity, name='analyze-project'),
    path('submit/', submit_request, name='submit-request'),
    path('', include(router.urls)),
]
