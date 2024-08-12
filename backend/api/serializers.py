from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Document
from .github import Github
from .util import register_social_user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ["id", "title", "author", "is_archived", "parent_id", "content", "cover_image", "icon", "is_published"]
        extra_kwargs = {"author": {"read_only": True}}

class GithubOauthSerializer(serializers.Serializer):
    code = serializers.CharField(min_length=2)

    def validate_code(self, code):
        access_token = Github.exchange_code_for_token(code)
        if access_token:
            user = Github.retrieve_github_user(access_token)
            if user.get("login"):
                email = user.get("email")
                username = user.get("login")
                return register_social_user(email, username)

        else:
            raise ValidationError("token is invalid or has expired")