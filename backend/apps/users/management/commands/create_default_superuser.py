from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create a superuser with a password'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        username = settings.SUPER_LOGIN.split('@')[0]
        email = settings.SUPER_LOGIN
        password = settings.SUPER_PASSWORD

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING('User with this email already exists.'))
        else:
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Successfully created superuser {email}'))
