# Generated by Django 5.1.1 on 2024-09-10 16:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='avatars/default_avatar.jpg', upload_to='avatars/'),
        ),
    ]
