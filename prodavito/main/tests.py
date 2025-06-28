from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import Ad
from django.urls import reverse

class AddingAdTest(TestCase): #'AddingAdAndAds' - думаю потом у нас такие вот будут ad'инги
    def setUp(self):
        # Создаем клиента для тестирования
        self.client = Client()

        # Создаем тестового пользователя
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword'
        )

        # Авторизуем пользователя
        self.client.login(username='testuser', password='testpassword')

    def test_add_ad(self):
        data = {
            'title': 'TestTitle',
            'description': 'TestDecsription',
            'image_url': '',
            'category': 'TestCategory',
            'condition': 'new',
        }
        response = self.client.post(reverse('ad_create'), data)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(Ad.objects.count(), 1)
        ad = Ad.objects.first()
        self.assertEqual(ad.user, self.user)