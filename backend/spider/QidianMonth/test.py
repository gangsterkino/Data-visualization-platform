from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from QidianMonth.spiders.qidian import QidianSpider

setting = get_project_settings()
setting.set('FEED_URI', 'ouput.json')
setting.set('FEED_FORMAT', 'json')

process = CrawlerProcess(get_project_settings())

process.crawl(QidianSpider)
process.start()
