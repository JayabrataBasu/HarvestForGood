from django.test import TestCase

# Create your tests here.
from rest_framework.test import APITestCase
from django.urls import reverse
from .models import Academic, Category

class AcademicAPITest(APITestCase):
    def setUp(self):
        self.category = Category.objects.get(id=1)
        self.academic = Academic.objects.create(
            title="Test Academic",
            description="Test Description",
            category=self.category
        )

    def test_list_academic(self):
        url = reverse('academic-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
