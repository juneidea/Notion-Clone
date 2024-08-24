from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, AccountSerializer, DocumentSerializer, GithubOauthSerializer
from .models import Document, Account

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

class PreviewList(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = []

    def get_queryset(self):
        documentId = self.request.query_params.get('documentId')
        isPublished = self.request.query_params.get('isPublished')
        return Document.objects.filter(is_published=isPublished, id=documentId)

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
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [AllowAny]

class GetUserView(generics.RetrieveAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        qs = self.get_queryset()
        obj = get_object_or_404(qs, user_id=self.request.user.id)
        return obj

class GithubSignInView(generics.GenericAPIView):
    serializer_class=GithubOauthSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid(raise_exception=True):
            data = ((serializer.validated_data)['code'])
            return Response(data, status = status.HTTP_200_OK)
        return Response(data=serializer.errors, status = status.HTTP_400_BAD_REQUEST)