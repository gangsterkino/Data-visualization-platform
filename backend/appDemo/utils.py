from datetime import timedelta
from django.utils.dateparse import parse_date
from collections import defaultdict
import datetime


def parse_date_input(date_input):
    if date_input:
        if ',' in date_input:  # Assuming a date range is separated by a comma
            start_date_str, end_date_str = date_input.split(',', 1)
            start_date = datetime.datetime.strptime(start_date_str.strip(), '%Y-%m-%d').date()
            end_date = datetime.datetime.strptime(end_date_str.strip(), '%Y-%m-%d').date()
        else:  # Single date
            start_date = end_date = datetime.datetime.strptime(date_input.strip(), '%Y-%m-%d').date()
    else:  # Default to full range
        start_date = None
        end_date = None
    return start_date, end_date


def format_growth_data(query_result, target_name, ranking_target):
    """

    """
    if ranking_target not in ['today_votes', 'today_clicks', 'growth_votes', 'growth_clicks']:
        ranking_target = 'growth_votes'

    growth_data = defaultdict(list)
    for item in query_result:
        growth_data[item[target_name]].append({
            "date": item['date'],
            "rating_votes": item['total_rating_votes'],
            "click_nums": item['total_click_nums']
        })

    intermediate_data = []
    for target, daily_data in growth_data.items():
        today_votes = daily_data[-1]['rating_votes']
        yesterday_votes = daily_data[-2]['rating_votes']
        today_clicks = daily_data[-1]['click_nums']
        yesterday_clicks = daily_data[-2]['click_nums']

        growth_votes = today_votes - yesterday_votes
        growth_clicks = today_clicks - yesterday_clicks
        intermediate_data.append({
            'today_votes': today_votes,
            'today_clicks': today_clicks,
            "growth_votes": growth_votes,
            "growth_clicks": growth_clicks,
            target_name: target,
            "daily": daily_data

        })

    sorted_data = sorted(intermediate_data, key=lambda x: x[ranking_target], reverse=True)

    return sorted_data[:100]
