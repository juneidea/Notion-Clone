from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Document, Account
from .github import Github
from .util import register_social_user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class AccountSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)
    class Meta:
        model = Account
        fields = "__all__"

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_instance = User.objects.create(
        username=user_data['username'],email=user_data['email'], password=user_data['password'])
        user_instance.save()
        
        account_instance = Account.objects.create(
            **validated_data, user=user_instance)
        account_instance.save()
        return account_instance
    
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
                avatar = user.get("avatar_url")
                return register_social_user(email, username, avatar)

        else:
            raise ValidationError("token is invalid or has expired")