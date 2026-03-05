from django.urls import path
from .views import TaskListCreateView, TaskDetailView, TaskStatsView

urlpatterns = [
    path('', TaskListCreateView.as_view(), name='tasks'),
    path('stats/', TaskStatsView.as_view(), name='task-stats'),
    path('<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
]