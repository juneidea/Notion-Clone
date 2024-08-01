from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics
from .serializers import UserSerializer, DocumentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Document

class DocumentListCreate(generics.ListCreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        parentId = self.request.query_params.get('parentId')
        documentId = self.request.query_params.get('documentId')
        # ?isArchived=True
        isArchived = self.request.query_params.get('isArchived')
        if parentId and isArchived:
            return Document.objects.filter(author=user, parent_id=parentId, is_archived=isArchived)
        if parentId:
            return Document.objects.filter(author=user, parent_id=parentId, is_archived=False)
        if documentId:
            return Document.objects.filter(author=user, id=documentId)
        if isArchived:
            return Document.objects.filter(author=user, is_archived=isArchived)
        return Document.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class DocumentDelete(generics.DestroyAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Document.objects.filter(author=user)

class DocumentUpdate(generics.UpdateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Document.objects.filter(author=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class GetUserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        qs = self.get_queryset()
        obj = get_object_or_404(qs, id=self.request.user.id)
        return obj
