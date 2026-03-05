from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from .models import Task
from .serializers import TaskSerializer


class TaskListCreateView(generics.ListCreateAPIView):

    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = ['status', 'priority']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'deadline']

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)


class TaskStatsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        total_tasks = Task.objects.filter(user=user).count()

        completed_tasks = Task.objects.filter(
            user=user,
            status='COMPLETED'
        ).count()

        pending_tasks = Task.objects.filter(
            user=user,
            status='PENDING'
        ).count()

        completion_rate = 0

        if total_tasks > 0:
            completion_rate = (completed_tasks / total_tasks) * 100

        data = {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "completion_rate": round(completion_rate, 2)
        }

        return Response(data)