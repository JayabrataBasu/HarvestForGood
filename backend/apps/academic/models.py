from django.db import models
from taggit.managers import TaggableManager

class Category(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name
    
    # Create a default category
DEFAULT_CATEGORY_ID = 1

class Academic(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT, default=DEFAULT_CATEGORY_ID)
    tags = TaggableManager()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Attachment(models.Model):
    academic = models.ForeignKey(Academic, on_delete=models.CASCADE)
    file = models.FileField(upload_to='attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)

class Rating(models.Model):
    academic = models.ForeignKey(Academic, on_delete=models.CASCADE)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    score = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['academic', 'user']
