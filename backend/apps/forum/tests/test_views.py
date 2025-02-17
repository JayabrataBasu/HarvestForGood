from django.test import TestCase

# Create your tests here.
# forum/tests/test_views.py
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from forum.models import ForumPost, Comment

class ForumPostTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='SampleMan',
            password='sample123'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_post(self):
        data = {'title': 'Test Post', 'content': 'Test Content'}
        response = self.client.post('/api/forum/posts/', data, format='json')
        self.assertEqual(response.status_code, 201)
