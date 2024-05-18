from rest_framework import serializers
from .models import Novels, NovelsHistory, Users
from django.db.models import Count, Avg, Max, Sum
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password


class NovelsHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NovelsHistory
        fields = '__all__'


class NovelsSerializer(serializers.ModelSerializer):
    history = NovelsHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Novels
        fields = '__all__'

    def create(self, validated_data):
        daily_stats_data = validated_data.pop('daily_stats', None)
        novel = Novels.objects.create(**validated_data)
        if daily_stats_data:
            for stats_data in daily_stats_data:
                NovelsHistory.objects.create(novel=novel, **stats_data)
        self.recalculate_totals(novel)
        return novel

    def update(self, instance, validated_data):
        daily_stats_data = validated_data.pop('daily_stats', None)
        novel = super().update(instance, validated_data)
        if daily_stats_data:
            for stats_data in daily_stats_data:
                date = stats_data.get('date')
                stats_instance = novel .novels_history.filter(date=date).first()
                if stats_instance:
                    for key, value in stats_data.items():
                        setattr(stats_instance, key, value)  # update NovelsHistory
                else:
                    NovelsHistory.objects.create(novel=novel, **stats_data)
        self.recalculate_totals(novel)
        return instance

    def recalculate_totals(self, novel):
        # Aggregate new totals from NovelsHistory
        totals = NovelsHistory.objects.filter(novel=novel).aggregate(
            total_word_count=Sum('word_count'),
            total_rating_votes=Sum('rating_votes'),
            total_click_nums=Sum('click_nums'))
        # Update Novels with new totals
        Novels.objects.filter(id=novel.id).update(
            word_count=totals['total_word_count'] or 0,
            rating=totals['total_rating_votes'] or 0,
            click_nums=totals['total_click_nums'] or 0)


User = get_user_model()


class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User(
            username=validated_data['email'],
            email=validated_data['email'],
            password=make_password(validated_data['password'])
        )
        user.save()

        return user