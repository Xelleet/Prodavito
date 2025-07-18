from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from prodavito.main import consumers

application = ProtocolTypeRouter({
    "websocket": URLRouter([
        path("ws/chat/<int:user_id>/", consumers.ChatConsumer),
    ]),
})