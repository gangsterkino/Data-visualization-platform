import random
import string

from django.db.models import Count, Avg, Max, Sum, F, ExpressionWrapper, FloatField, DateField
from django.db.models.functions import Lag, TruncDay, Cast
from django.db.models.expressions import Window
from django.db import transaction


from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import timedelta

from django.contrib.auth import authenticate, login
from .models import Novels, NovelsHistory, Users
from .serializers import NovelsSerializer, UserSignupSerializer
from .utils import parse_date_input, format_growth_data
from django.core.mail import send_mail

RANKING_TARGETS = ['word_count', 'rating_votes', 'click_nums']

aggregated_data = {
    'count': [],
    'growth': []
}


class NovelView(viewsets.ModelViewSet):
    """
    ModelViewSet include CRUD
    """

    queryset = Novels.objects.all()
    serializer_class = NovelsSerializer

    @action(detail=False, methods=['post'], url_path='upload')
    def upload(self, request, *args, **kwargs):
        json_data = request.data
        if not isinstance(json_data, list):
            return Response({"error": "Expected a list of items"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            for item in json_data:
                daily_stats_data = item.pop('daily_stats', [])
                instance = Novels.objects.filter(name=item.get('name')).first()  # ensure name unique
                if instance:
                    serializer = self.get_serializer(instance, data=item, partial=True)  # use serializers update
                else:
                    serializer = self.get_serializer(data=item)  # use serializers create
                if serializer.is_valid():
                    serializer.save(daily_stats=daily_stats_data)  # let validate_date.pop 'daily_date' to use it
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            # Bulk create novels to optimize database calls
        return Response({"message": "File processed successfully"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='view_sort')
    def view_sort(self, request, *args, **kwargs):
        # Get the sorting field from the POST request, defaults to 'rating'
        sort_field = request.data.get('sort_field', 'rating')
        # Verify that the sort field is valid
        if sort_field not in ['rating', 'click_nums', 'word_count']:
            return Response({"error": "Invalid sort field"}, status=status.HTTP_400_BAD_REQUEST)
        # use sort
        novels = Novels.objects.all().order_by(f'-{sort_field}').values(*['name', 'rating', 'primary_genre'])
        page = self.paginate_queryset(novels)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(novels, many=True)

        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='statistics')
    def statistics(self, request, *args, **kwargs):
        analysis_target = request.data.get('analysis_target', 'primary_genre').strip()

        if analysis_target == 'primary_genre':
            # compute numbers of each primary_genre
            result = Novels.objects.values('primary_genre').annotate(total=Count('primary_genre')).order_by('-total')[
                     : 10]
            analysis_data = list(result)
        else:
            return Response({"error": "Invalid analysis target"}, status=status.HTTP_400_BAD_REQUEST)

        response = {
            "analysis_target": analysis_target,
            "data": analysis_data,
            "message": "Statistics fetched successfully"
        }

        return Response(data=response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='check_genre')
    def check_genre(self, request, *args, **kwargs):
        ranking_target = request.data.get('ranking_target', 'today_votes').strip()

        queryset = Novels.objects.all()

        aggregated_data['count'] = (queryset.values('primary_genre')
                                    .annotate(rating_votes=Sum('novels_history__rating_votes'),
                                              click_nums=Sum('novels_history__click_nums'))
                                    .order_by(f'-rating_votes'))
        growth_data = (NovelsHistory.objects
                       .values('date', primary_genre=F('novel__primary_genre'))
                       .annotate(total_rating_votes=Sum('rating_votes'),
                                 total_click_nums=Sum('click_nums'))
                       .order_by('primary_genre', 'date'))

        aggregated_data['growth'] = format_growth_data(growth_data, 'primary_genre', ranking_target)
        return Response(aggregated_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='noval_rank')
    def noval_rank(self, request, *args, **kwargs):
        """
            post type:
            {
                novel_name: novel name,
                ranking_type: ranking type, RANKING_TYPES = ['growth', 'count']
                ranking_target: ranking target, RANKING_TARGETS = ['word_count', 'rating_votes', 'click_nums']
                primary_genre: primary genre
                date_range:  date range, type: 'YYYY-MM-DD, YYYY-MM-DD'
            }
        """
        # post set
        novel_name = request.data.get('novel_name', 'all').strip()
        ranking_target = request.data.get('ranking_target', 'today_votes').strip()
        primary_genre = request.data.get('primary_genre', '玄幻').strip()
        date_range = request.data.get('date_range', '2024-01-01, 2024-01-10')
        start_date, end_date = parse_date_input(date_input=date_range) if date_range else (None, None)

        # date range
        queryset = Novels.objects.filter(novels_history__date__range=[start_date, end_date]) if start_date and end_date \
            else Novels.objects.all()

        if str(novel_name).lower() in ('all', '所有'):  # if choose all novels
            if primary_genre.lower() not in ('all', '所有'):  # if set primary genre
                queryset = queryset.filter(primary_genre=primary_genre)
                aggregated_data['count'] = (queryset.values('name', 'primary_genre')
                                            .annotate(rating_votes=Sum('novels_history__rating_votes'),
                                                      word_count=Sum('novels_history__word_count'),
                                                      click_nums=Sum('novels_history__click_nums')
                                                      )
                                            .order_by(f'-rating_votes')[:100])

                growth_data = (NovelsHistory.objects.filter(novel__primary_genre=primary_genre)
                               .values('date', name=F('novel__name'))
                               .annotate(total_rating_votes=Sum('rating_votes'),
                                         total_click_nums=Sum('click_nums'))
                               .order_by('name', 'date'))
                aggregated_data['growth'] = format_growth_data(growth_data, 'name', ranking_target)

            else:
                aggregated_data['count'] = (queryset.values('name', 'primary_genre')
                                            .annotate(rating_votes=Sum('novels_history__rating_votes'),
                                                      word_count=Sum('novels_history__word_count'),
                                                      click_nums=Sum('novels_history__click_nums')
                                                      )
                                            .order_by(f'-rating_votes')[:100])

                growth_data = (NovelsHistory.objects
                               .values('date', name=F('novel__name'))
                               .annotate(total_rating_votes=Sum('rating_votes'),
                                         total_click_nums=Sum('click_nums'))
                               .order_by('name', 'date'))
                aggregated_data['growth'] = format_growth_data(growth_data, 'name', ranking_target)

        else:
            queryset = NovelsHistory.objects.filter(novel__name=novel_name)
            top_day = queryset.order_by('-rating_votes').first().date

            date_range_start = top_day - timedelta(days=2)
            date_range_end = top_day + timedelta(days=2)
            queryset = queryset.filter(date__range=[date_range_start, date_range_end])
            aggregated_data['count'] = queryset.values('novel__name', 'rating_votes', 'word_count', 'click_nums',
                                                       'date')
            aggregated_data['growth'] = []

        return Response(aggregated_data, status=status.HTTP_200_OK)


class SignView(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UserSignupSerializer

    @action(detail=False, methods=['post'], url_path='check_email')
    def check_email(self, request, *args, **kwargs):
        email = request.data.get('email', 'shuojianmo@gmail.com')
        if email:
            verification_code = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
            request.session['verification_code'] = verification_code
            request.session.save()
            send_mail(
                'AIM Verification Code',  # email title
                f'Your verification code is: {verification_code}',  # email content
                'yangxue_666@outlook.com',  # sender
                [email],  # Recipient list
                fail_silently=False,
            )
            return Response({'pass': 1, 'message': 'successful send'}, status=status.HTTP_200_OK)

        return Response({'pass': 0, 'message': 'send error'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='check_v_code')
    def check_v_code(self, request, *args, **kwargs):
        v_code = request.data.get('v_code', 't3NElk').strip()
        session_code = request.session.get('verification_code')
        if v_code == session_code:
            del request.session['verification_code']
            return Response({'pass': 1, 'message': 'successful verification'}, status=status.HTTP_200_OK)
        else:
            return Response({'pass': 0, 'message': 'error verification code'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='register_user')
    def register_user(self, request, *args, **kwargs):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user_id': user.id,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='login_user')
    def login_user(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return Response({"login": 1}, status=status.HTTP_200_OK)
        else:
            return Response({"login": 0}, status=status.HTTP_400_BAD_REQUEST)

