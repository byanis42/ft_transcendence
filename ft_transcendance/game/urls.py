from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, MatchViewSet
from . import views

from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'matches', MatchViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]

from django.urls import path
from .views import login, callback

urlpatterns = [
    path('login/', views.login, name='login'),
	path('logout/', views.logout_view, name='logout'),
    path('oauth/callback/', callback, name='callback'),
	path('', views.index, name='index'),
	path('dashboard/', views.dashboard, name='dashboard'),
	path('profile/', views.profile, name='profile'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
