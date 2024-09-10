# game/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Champs supplémentaires pour l'utilisateur
    display_name = models.CharField(max_length=50, unique=True)
    avatar = models.ImageField(upload_to='avatars/', default='avatars/default_avatar.jpg')
    friends = models.ManyToManyField('self', blank=True)  # Pour gérer la liste d'amis

    def __str__(self):
        return self.display_name

from django.utils import timezone

class Match(models.Model):
    player1 = models.ForeignKey(User, related_name='matches_as_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(User, related_name='matches_as_player2', on_delete=models.CASCADE)
    score_player1 = models.IntegerField(default=0)
    score_player2 = models.IntegerField(default=0)
    match_date = models.DateTimeField(default=timezone.now)
    is_finished = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.player1} vs {self.player2} on {self.match_date}"
