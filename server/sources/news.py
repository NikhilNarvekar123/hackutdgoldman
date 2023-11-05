import os
import sys
import requests
from requests.utils import requote_uri
sys.path.append(os.path.realpath('..'))

from .lib.message import Message
from .lib.perception import relative_calculate_perception

from util.config import Config

NEWS_API_KEY = Config.NEWS_API_KEY

class News:
    def __init__(self, start_time: str, end_time: str) -> None:
        self.start_time = start_time
        self.end_time = end_time

    def calculate_perception(self, stock_ticker: str) -> float:
        news_messages: list[Message] = self.get_messages(stock_ticker)

        if not news_messages:
            value: float = 0
        elif news_messages[0].popularity > 5000:
            value: float = 1
        else:
            value: float = news_messages[0].popularity / 5000
        
        perception: float = 0.0
        for message in news_messages:
            perception += message.perception
        
        if not news_messages:
            perception = 0
        else:
            perception = perception / len(news_messages)
        
        return perception, value

    def get_messages(self, company_name: str) -> list[Message]:
        messages: list[Message] = []
        company_name = requote_uri(f"{company_name} stock")

        url: str = f"https://gnews.io/api/v4/search?q={company_name}&apikey={NEWS_API_KEY}&country=us&max=10&sortby=relevance&from={self.start_time}&to={self.end_time}"
        all_articles: dict[str, str] = requests.get(url).json()
        
        for article in all_articles.get("articles", []):
            perception: float = relative_calculate_perception(article.get("title", ""))
            total_results: int = all_articles.get("totalArticles", 0)
            message: Message = Message(perception, total_results, "News", article.get("title", ""))
            messages.append(message)
        
        messages.sort(key=lambda x: x.perception)
        self.top_titles: list[str] = [message.content for message in messages[-3:]]
        self.bottom_titles: list[str] = [message.content for message in messages[:3]]
        
        return messages
    