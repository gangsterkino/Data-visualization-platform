from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
app_name = "appDemo"

router.register(r'novels', views.NovelView, basename='novel')
router.register(r'sign', views.SignView, basename='sign')


urlpatterns = [
    path("", include(router.urls)),
]

