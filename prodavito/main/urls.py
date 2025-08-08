from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('csrf/', views.get_csrf_token, name='csrf'),
    path('profile/<int:index>', views.profile_view, name='profile'),
    path('api/me/', views.get_me, name='get_me'),
    path('api/register/', views.RegisterAPIView.as_view(), name='register'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path('api/add_ad/', views.AdAPIView.as_view(), name='add_ad'),
    path('api/ads/', views.AdListView.as_view(), name='ads'),
    path('api/ads/<int:pk>/', views.AdDetailView.as_view(), name='ad_detail'),
    path('api/chat/inbox/', views.api_inbox, name='inbox'),
    path('api/chat/<int:user_id>/messages/', views.api_chat_classes, name='api_chat_with'),
    path('api/chat/<int:user_id>/send/', views.api_send_message, name='api_send_message'),
    path('api/logout/', views.LogoutView.as_view(), name='logout'),
    path('api/ad_update/<int:id>/', views.update_ad, name='ad_update'),
    path('ad_delete/<int:pk>', views.ad_delete, name='ad_delete'),
    path('', views.ad_list, name='ad_list'),
    path('exchange/create/', views.create_exchange_proposal, name='create_exchange_proposal'),
    path('exchange/<int:pk>', views.proposal_detail, name='proposal_detail'),
    path('exchange/<int:pk>/update_status', views.update_proposal_status, name='update_proposal_status'),
    path('exchange/my/', views.my_proposals, name='my_proposals'),
    path('chat/', views.inbox, name='inbox'),
    path('chat/<int:user_id>/', views.chat_with, name='chat_with'),
    path('chat/send/<int:user_id>/', views.send_message, name='send_message')
]