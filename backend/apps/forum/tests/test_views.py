# Create your tests here.
# forum/tests/test_views.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from apps.forum.models import ForumPost

class ForumAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.post = ForumPost.objects.create(title="Test", content="Content")

    def test_post_list(self):
        response = self.client.get(reverse('forum-post-list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test")

