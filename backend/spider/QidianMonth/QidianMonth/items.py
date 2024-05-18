# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class QidianScraperItem(scrapy.Item):
    name = scrapy.Field()
    primary_genre = scrapy.Field()
    daily_stats = scrapy.Field()


# class QidianScraperItem(scrapy.Item):
#     # define the fields for your item here like:
#     # name = scrapy.Field()
#     rank_list = scrapy.Field()
#     category = scrapy.Field()
#     name = scrapy.Field()
#     latest_chapter = scrapy.Field()
#     monthly_ticket = scrapy.Field()
#     author = scrapy.Field()
#     updated_time = scrapy.Field()