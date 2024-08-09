from django.db import models
from django.contrib.auth.models import User

class Document(models.Model):
    title = models.CharField(max_length=100, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="documents")
    is_archived = models.BooleanField(blank=True)
    parent_id = models.IntegerField(default=-1, blank=True)
    content = models.TextField(blank=True)
    cover_image = models.CharField(max_length=500, blank=True)
    icon = models.CharField(max_length=10, blank=True)
    is_published = models.BooleanField(blank=True)

    def __str__(self):
        return self.title

