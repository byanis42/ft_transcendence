from django.contrib.auth.backends import ModelBackend
from .models import User

class API42Backend(ModelBackend):
	def authenticate(self, request, username=None, **kwargs):
		try:
			user = User.objects.get(username=username)
			return user
		except User.DoesNotExist:
			return None
