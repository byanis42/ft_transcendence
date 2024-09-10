# game/serializers.py

from rest_framework import serializers
from .models import User, Match

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'display_name', 'avatar']

class MatchSerializer(serializers.ModelSerializer):
    player1 = UserSerializer()
    player2 = UserSerializer()

    class Meta:
        model = Match
        fields = ['id', 'player1', 'player2', 'score_player1', 'score_player2', 'match_date']
