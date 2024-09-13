from django.shortcuts import render
from django.http import JsonResponse
from .models import User

# Fonction pour lister les utilisateurs
def user_list(request):
    users = User.objects.all()
    data = [{"id": user.id, "display_name": user.display_name, "avatar": user.avatar.url} for user in users]
    return JsonResponse(data, safe=False)

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
import json

@csrf_exempt
def create_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.create(
            username=data['username'],
            display_name=data['display_name'],
            password=make_password(data['password'])  # Hash du mot de passe
        )
        return JsonResponse({
            'id': user.id,
            'display_name': user.display_name
        }, status=201)

from rest_framework import viewsets
from .models import User, Match
from .serializers import UserSerializer, MatchSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer

import requests
from django.conf import settings
from django.shortcuts import redirect

# Fonction pour gérer l'authentification via l'API 42
def login(request):
    # Construire l'URL de redirection vers l'API 42
    client_id = settings.CLIENT_ID
    redirect_uri = settings.REDIRECT_URI
    url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"

    return redirect(url)

# Callback après authentification OAuth via l'API 42
from django.contrib.auth import login as auth_login
from django.contrib.auth import authenticate
from .models import User

def callback(request):
    code = request.GET.get('code')

    if code:
        # Échanger le code contre un token d'accès
        token_url = "https://api.intra.42.fr/oauth/token"
        data = {
            'grant_type': 'authorization_code',
            'client_id': settings.CLIENT_ID,
            'client_secret': settings.CLIENT_SECRET,
            'code': code,
            'redirect_uri': settings.REDIRECT_URI,
        }
        response = requests.post(token_url, data=data)
        response_data = response.json()

        access_token = response_data.get('access_token')
        if access_token:
            # Obtenir les informations de l'utilisateur depuis l'API 42
            user_info = get_user_info(access_token)

            # Sauvegarder ou créer l'utilisateur dans la base de données
            user = save_user(user_info)

            # Authentifier l'utilisateur dans Django avec notre backend personnalisé
            user = authenticate(request, username=user.username)
            if user is not None:
                auth_login(request, user)
                # Rediriger vers le tableau de bord
                return redirect('dashboard')

    # Si quelque chose échoue, rediriger vers l'index
    return redirect('index')


# Fonction pour obtenir les informations de l'utilisateur depuis l'API 42
def get_user_info(access_token):
    user_url = 'https://api.intra.42.fr/v2/me'
    headers = {'Authorization': f'Bearer {access_token}'}
    user_response = requests.get(user_url, headers=headers)
    return user_response.json()

# Fonction pour enregistrer ou créer un utilisateur dans la base de données
def save_user(user_info):
    user, created = User.objects.get_or_create(
        username=user_info['login'],
        defaults={
            'display_name': user_info.get('displayname', 'Anonyme'),
            'avatar': 'avatars/default_avatar.jpg'  # Utiliser l'avatar local par défaut
        }
    )

    # Si l'utilisateur existe déjà et a une URL d'avatar externe, ne pas la prendre en compte
    if not created and not user.avatar:
        user.avatar = 'avatars/default_avatar.jpg'
        user.save()

    return user

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import AvatarUploadForm

@login_required
def profile(request):
    avatar_path = os.path.join(settings.MEDIA_ROOT, 'avatars')
    avatars = [
        'avatars/' + f for f in os.listdir(avatar_path)
        if os.path.isfile(os.path.join(avatar_path, f)) and f != 'default_avatar.jpg'
    ]

    if request.method == 'POST':
        data = json.loads(request.body)
        selected_avatar = data.get('avatar')

        if selected_avatar and selected_avatar in avatars:
            request.user.avatar = selected_avatar
            request.user.save()
            return JsonResponse({
                'status': 'success',
                'new_avatar_url': request.user.avatar.url  # Envoi de l'URL du nouvel avatar
            })

    context = {
        'avatars': avatars,
        'selected_avatar': request.user.avatar,  # Pass the selected avatar to the template
        'MEDIA_URL': settings.MEDIA_URL
    }

    return render(request, 'game/profile.html', context)


@login_required
def dashboard(request):
    return render(request, 'game/dashboard.html')

from rest_framework.decorators import api_view
from rest_framework.response import Response

# API pour récupérer les données du tableau de bord
@api_view(['GET'])
def dashboard_data(request):
    data = {
        'welcome_message': 'Bienvenue sur le tableau de bord!',
        'stats': {
            'users_count': 120,
            'projects_count': 42
        }
    }
    return Response(data)

# Vue index
def index(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    return render(request, 'game/index.html')


from django.contrib.auth import logout

@login_required
def logout_view(request):
    logout(request)
    return redirect('index')


from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth.decorators import login_required
import os

@login_required
def profile(request):
    avatar_path = os.path.join(settings.MEDIA_ROOT, 'avatars')
    avatars = [
        'avatars/' + f for f in os.listdir(avatar_path)
        if os.path.isfile(os.path.join(avatar_path, f)) and f != 'default_avatar.jpg'
    ]

    if request.method == 'POST':
        data = json.loads(request.body)
        selected_avatar = data.get('avatar')

        if selected_avatar and selected_avatar in avatars:
            request.user.avatar = selected_avatar
            request.user.save()
            return JsonResponse({
                'status': 'success',
                'new_avatar_url': request.user.avatar.url  # Envoi de l'URL du nouvel avatar
            })

    context = {
        'avatars': avatars,
        'MEDIA_URL': settings.MEDIA_URL
    }

    return render(request, 'game/profile.html', context)

    return render(request, 'game/profile.html', context)

from django.http import JsonResponse
from .models import Avatar  # Si vous avez un modèle pour les avatars

def api_avatars(request):
    avatars = Avatar.objects.all()
    data = [{"name": avatar.name, "url": avatar.image.url} for avatar in avatars]
    return JsonResponse(data, safe=False)
