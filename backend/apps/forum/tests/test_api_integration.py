from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

class ForumAPIIntegrationTests(TestCase):
    def test_full_workflow(self):
        client = APIClient()
        
        # Create post
        response = client.post(reverse('forum-post-list'), {
            "title": "Integration Test",
            "content": "Test content"
        }, format='json')
        self.assertEqual(response.status_code, 201)
        
        # Retrieve post
        post_id = response.data['id']
        response = client.get(reverse('forum-post-detail', args=[post_id]))
        self.assertEqual(response.status_code, 200)
