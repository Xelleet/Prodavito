from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('profile/<int:index>', views.profile_view, name='profile'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('add_ad/', views.ad_create, name='ad_create'),
    path('ad_update/<int:pk>', views.ad_update, name='ad_update'),
    path('ad_delete/<int:pk>', views.ad_delete, name='ad_delete'),
    path('', views.ad_list, name='ad_list'),
]