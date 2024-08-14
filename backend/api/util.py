from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from api.models import Account

SOCIAL_AUTH_PASSWORD = 'SocialPass1'

def login_user(username, password):
      user = authenticate(username=username, password=password)
      user_tokens = user.tokens()
      return {
        'access_token': str(user_tokens.get('access')),
        'refresh_token': str(user_tokens.get('refresh'))
      }

def register_social_user(email, username, avatar):
    user = User.objects.filter(email=email)
    if user.exists():
      result = login_user(username=username, password=SOCIAL_AUTH_PASSWORD)
      return result
    else:
      new_user = {
        'email': email,
        'username': username,
        'password': SOCIAL_AUTH_PASSWORD
      }
      register_user = User.objects.create_user(**new_user)
      register_user.save()
      account_user = Account.objects.create(user=register_user, avatar=avatar)
      account_user.save()
      result = login_user(username=username, password=SOCIAL_AUTH_PASSWORD)
      return result