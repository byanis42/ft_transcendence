from django.test import TestCase
from .models import User

class UserModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Crée un utilisateur pour tous les tests de cette classe
        User.objects.create(username='testuser', display_name='Test User')

    def test_display_name_label(self):
        user = User.objects.get(id=1)
        field_label = user._meta.get_field('display_name').verbose_name
        self.assertEquals(field_label, 'display name')

    def test_display_name_max_length(self):
        user = User.objects.get(id=1)
        max_length = user._meta.get_field('display_name').max_length
        self.assertEquals(max_length, 50)

    def test_object_name_is_display_name(self):
        user = User.objects.get(id=1)
        expected_object_name = f'{user.display_name}'
        self.assertEquals(expected_object_name, str(user))
