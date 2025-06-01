"""Файл-маршрутизатор для приложения workers."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView

from workers.views import (
    TeamViewSet, WorkerViewSet,
    LoginView, ProtectedView,
    LogoutView,
)


router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'workerы', WorkerViewSet, basename='worker')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('', include(router.urls)),
]
