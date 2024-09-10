from django import forms
from .models import User

class AvatarUploadForm(forms.ModelForm):
	class Meta:
		model = User
		fields = ['avatar']

from django import forms
from .models import User

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username']  # Permet à l'utilisateur de changer son nom d'utilisateur
