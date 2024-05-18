from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser


class Novels(models.Model):
    """Novels models"""
    source = models.CharField(max_length=255, default='未知')
    name = models.CharField(max_length=255, unique=True)
    author = models.CharField(max_length=255, default='未知')
    word_count = models.IntegerField(default=0)
    is_finished = models.BooleanField(default=False)
    first_update_date = models.DateTimeField(default=timezone.now)
    last_update_date = models.DateTimeField(default=timezone.now)
    primary_genre = models.CharField(max_length=200, default='未知')
    secondary_genre = models.CharField(max_length=200, default='未知')
    rating = models.FloatField(default=0.0)
    click_nums = models.IntegerField(default=0)
    crawl_time = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name


class NovelsHistory(models.Model):
    novel = models.ForeignKey('Novels', on_delete=models.CASCADE, related_name='novels_history')
    date = models.DateTimeField()
    word_count = models.IntegerField(default=0)
    rating_votes = models.FloatField(default=0.0)
    click_nums = models.IntegerField(default=0)

    class Meta:
        unique_together = ('novel', 'date')


# Users
class Users(AbstractUser):
    """Users models"""
    username = models.CharField(max_length=20, blank=True, null=True)
    phone_number = models.CharField(max_length=11, unique=True, blank=True, null=True)

    # Override the groups and user_permissions fields to specify related_name
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="appdemo_users_groups",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="appdemo_users_permissions",
        related_query_name="user",
    )

    def __str__(self):
        return self.name
