# qidian_spider.py

import json
import scrapy
from bs4 import BeautifulSoup
from datetime import datetime
from QidianMonth.items import QidianScraperItem

class QidianSpider(scrapy.Spider):
    name = 'qidian'
    def __init__(self, *args, **kwargs):
        super(QidianSpider, self).__init__(*args, **kwargs)
        self.month = kwargs.get('m', '03')
        self.max_page = int(kwargs.get('p', 20))

    def start_requests(self):
        month = self.month
        maxPage = self.max_page

        cookie = 'e1=%7B%22l6%22%3A%22%22%2C%22l1%22%3A5%2C%22pid%22%3A%22qd_P_rank_19%22%2C%22eid%22%3A%22qd_C36%22%7D; e2=%7B%22l6%22%3A%22%22%2C%22l1%22%3A5%2C%22pid%22%3A%22qd_P_rank_19%22%2C%22eid%22%3A%22qd_C35%22%7D; e1=%7B%22l6%22%3A%22%22%2C%22l1%22%3A5%2C%22pid%22%3A%22qd_P_rank_19%22%2C%22eid%22%3A%22qd_C44%22%7D; e2=%7B%22l6%22%3A%22%22%2C%22l1%22%3A5%2C%22pid%22%3A%22qd_P_rank_19%22%2C%22eid%22%3A%22qd_C44%22%7D; e1=%7B%22l6%22%3A%22%22%2C%22l1%22%3A5%2C%22pid%22%3A%22qd_P_rank%22%2C%22eid%22%3A%22qd_C45%22%7D; e2=%7B%22l6%22%3A%22%22%2C%22l1%22%3A5%2C%22pid%22%3A%22qd_P_rank%22%2C%22eid%22%3A%22%22%7D; newstatisticUUID=1707733372_388045257; fu=175903061; Hm_lvt_f00f67093ce2f38f215010b699629083=1707733376; _yep_uuid=6e5c0e7f-4e32-2a5a-74f0-612864bc7042; _gid=GA1.2.816040871.1707733378; e1=%7B%22l6%22%3A%22%22%2C%22l1%22%3A3%2C%22pid%22%3A%22qd_p_qidian%22%2C%22eid%22%3A%22qd_A16%22%7D; e2=%7B%22l6%22%3A%22%22%2C%22l1%22%3A3%2C%22pid%22%3A%22qd_p_qidian%22%2C%22eid%22%3A%22qd_A16%22%7D; _csrfToken=ca5e1144-6d91-4ab5-9344-a8a24e0a3285; ywkey=ywKogeSldyto; ywguid=3430738804; ywopenid=3E828132D80CA25745F08856AA2D620A; se_ref=baidu; traffic_utm_referer=; supportwebp=true; Hm_lpvt_f00f67093ce2f38f215010b699629083=1707970285; _gat_gtag_UA_199934072_2=1; _ga_PFYW0QLV3P=GS1.1.1707968103.9.1.1707970287.0.0.0; _ga=GA1.1.1761557434.1707733377; _ga_FZMMH98S83=GS1.1.1707968103.9.1.1707970287.0.0.0; listStyle=2; w_tsfp=ltvgWVEE2utBvS0Q6a3ul0itED07Z2R7xFw0D+M9Os08B6omUp2G1YZ6t9fldCyCt5Mxutrd9MVxYnCGX9ElfhIQTM2Rb5tH1VPHx8NlntdKRQJtA8rUDwVMKu8h7WJPdG1YcUyw32ktLYdAmbRiig8OunAn37ZlCa8hbMFbixsAqOPah5EpSirZ1QzEHmfHbHYAd6CepbUrsuUVon+FtATkZQ4lQbhC0kGPiHdBSiAj4wz7Jb4INwO/P9z+CrNv726iniv9eJCs2RYj4VA3sB49AtX02TXKL3ZEIAtrZViygr4ke66rJPo36mlMD/cMDAQHox0Q5uBqrBVKCS+7aXLbBvIstQEHR/ZQq8qvKi+Q1cvqIRoU'

        for i in range(0, maxPage+1):
            url = f'https://www.qidian.com/rank/yuepiao/year2024-month{month}-page{i}/'
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Cookie': cookie
            }
            yield scrapy.Request(url, self.parse, headers=headers)

    def parse(self, response):
        current_datetime = datetime.now()
        start_datetime = current_datetime.strftime('%Y-%m-%d ')

        soup = BeautifulSoup(response.text, 'html.parser')

        try:
            with open('output.json', 'r', encoding='utf-8') as existing_json_file:
                existing_data = json.load(existing_json_file)
        except FileNotFoundError:
            existing_data = []

        for tr in soup.find_all('tr')[1:]:
            tds = tr.find_all('td')
            ranking = tds[0].text.strip()
            category = tds[1].text.strip()
            name = tds[2].text.strip()
            latest_chapter = tds[3].text.strip()
            monthly_ticket = tds[4].text.strip()
            author = tds[5].text.strip()
            update_time = tds[6].text.strip()

            existing_novel = next((novel for novel in existing_data if novel['name'] == name), None)

            if existing_novel:
                yesterday_ticket = existing_novel['daily_stats'][-1]['monthly_ticket']
                try:
                    yesterday_ticket = int(yesterday_ticket)
                    today_ticket = int(monthly_ticket)
                    ticket_growth_rate = today_ticket - yesterday_ticket if yesterday_ticket is not None else None
                except ValueError:
                    ticket_growth_rate = None

                new_daily_stats = {
                    'date': start_datetime,
                    'word_count': None,
                    'rating_votes': ranking,
                    'click_nums': None,
                    'monthly_ticket': monthly_ticket,
                    'ticket_growth_rate': ticket_growth_rate
                }

                existing_novel['daily_stats'].append(new_daily_stats)
            else:

                novel_info = {
                    'name': name,
                    'primary_genre': category,
                    'daily_stats': [
                        {
                            'date': start_datetime,
                            'word_count': None,
                            'rating_votes': ranking,
                            'click_nums': None,
                            'monthly_ticket': monthly_ticket,
                            'ticket_growth_rate': monthly_ticket
                        }]
                }

                existing_data.append(novel_info)

        with open('output.json', 'w', encoding='utf-8') as json_file:
            json.dump(existing_data, json_file, ensure_ascii=False, indent=4)

        for novel_info in existing_data:
            item = QidianScraperItem()
            item['name'] = novel_info['name']
            item['primary_genre'] = novel_info['primary_genre']
            item['daily_stats'] = novel_info['daily_stats']
            yield item
