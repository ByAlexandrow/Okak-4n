from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, login_view, logout_view, current_user

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('current/', current_user, name='current-user'),
    path('', include(router.urls)),
]
