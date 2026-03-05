from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')

    title = models.CharField(max_length=255)

    description = models.TextField(blank=True)

    deadline = models.DateTimeField(null=True, blank=True)

    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title