# Generated by Django 5.1 on 2024-10-13 20:50

import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations
from django.db import models

import apps.users.managers


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('locations', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                (
                    'is_superuser',
                    models.BooleanField(
                        default=False,
                        help_text='Designates that this user has all permissions without explicitly assigning them.',
                        verbose_name='superuser status',
                    ),
                ),
                (
                    'username',
                    models.CharField(
                        help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.',
                        max_length=150,
                        validators=[django.contrib.auth.validators.UnicodeUsernameValidator()],
                        verbose_name='username',
                    ),
                ),
                (
                    'first_name',
                    models.CharField(
                        blank=True,
                        help_text='Required. 150 characters or fewer.',
                        max_length=150,
                        null=True,
                        verbose_name='first name',
                    ),
                ),
                (
                    'last_name',
                    models.CharField(
                        blank=True,
                        help_text='Required. 150 characters or fewer.',
                        max_length=150,
                        null=True,
                        verbose_name='last name',
                    ),
                ),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='email address')),
                (
                    'is_email_verified',
                    models.BooleanField(
                        default=False,
                        help_text='Indicates whether the user has verified their email address.',
                        verbose_name='email confirm',
                    ),
                ),
                (
                    'is_staff',
                    models.BooleanField(
                        default=False,
                        help_text='Designates whether the user can log into this admin site.',
                        verbose_name='staff status',
                    ),
                ),
                (
                    'is_active',
                    models.BooleanField(
                        default=True,
                        help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.',
                        verbose_name='active',
                    ),
                ),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                (
                    'groups',
                    models.ManyToManyField(
                        blank=True,
                        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
                        related_name='user_set',
                        related_query_name='user',
                        to='auth.group',
                        verbose_name='groups',
                    ),
                ),
                (
                    'user_permissions',
                    models.ManyToManyField(
                        blank=True,
                        help_text='Specific permissions for this user.',
                        related_name='user_set',
                        related_query_name='user',
                        to='auth.permission',
                        verbose_name='user permissions',
                    ),
                ),
            ],
            options={
                'verbose_name': 'User',
                'verbose_name_plural': 'Users',
                'db_table': 'user',
            },
            managers=[
                ('objects', apps.users.managers.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Create date')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Update date')),
                (
                    'picture',
                    models.ImageField(
                        blank=True,
                        help_text='Upload a profile picture.',
                        null=True,
                        upload_to='user_pictures/',
                        verbose_name='profile picture',
                    ),
                ),
                (
                    'phone_numbers',
                    models.JSONField(
                        blank=True,
                        default=list,
                        help_text='You can add multiple phone numbers.',
                        null=True,
                        verbose_name='Phone numbers',
                    ),
                ),
                ('is_fake_user', models.BooleanField(default=False, verbose_name='fake user')),
                ('user_olx_id', models.IntegerField(blank=True, null=True, verbose_name='USER OLX ID')),
                (
                    'location',
                    models.ForeignKey(
                        blank=True,
                        help_text="This field allows you to specify the user's city and region.",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name='users',
                        to='locations.location',
                        verbose_name='Location',
                    ),
                ),
                (
                    'user',
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='profile',
                        to=settings.AUTH_USER_MODEL,
                        verbose_name='User',
                    ),
                ),
            ],
            options={
                'verbose_name': 'Profile',
                'verbose_name_plural': 'Profiles',
                'db_table': 'user_profile',
            },
        ),
    ]
