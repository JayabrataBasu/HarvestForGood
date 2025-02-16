from rest_framework.test import APITestCase
from django.urls import reverse
from apps.academic.models import Academic, Category
from apps.users.models import User

class AcademicAPITest(APITestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        # Get default category
        self.category = Category.objects.get(id=1)
        # Create test academic entry
        self.academic = Academic.objects.create(
            title="Test Academic",
            description="Test Description",
            category=self.category
        )
        # Authenticate
        self.client.force_authenticate(user=self.user)

    def test_list_academic(self):
        url = reverse('academic-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0)

    def test_create_academic(self):
        url = reverse('academic-list')
        data = {
            'title': 'New Academic',
            'description': 'New Description',
            'category': self.category.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
