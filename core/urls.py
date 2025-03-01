from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.views.generic import TemplateView

# Simple view function for the root URL
def home_view(request):
    return HttpResponse("<h1>Welcome to Harvest For Good</h1><p>The application is running successfully.</p>")

urlpatterns = [
    path('admin/', admin.site.urls),
    # Add the root URL pattern
    path('', home_view, name='home'),
    # Include other app URLs here
    path('api/', include('apps.users.urls')),
    # Add any other URL patterns you need
]
