import praw
from .lib.message import Message
from .lib.perception import relative_calculate_perception
from util.config import Config

REDDIT_USERNAME = Config.REDDIT_USERNAME
REDDIT_PASSWORD = Config.REDDIT_PASSWORD
REDDIT_APP_ID = Config.REDDIT_APP_ID
REDDIT_APP_SECRET = Config.REDDIT_APP_SECRET

class Reddit:
    def __init__(self, start_time: str, end_time: str):
        self.reddit = praw.Reddit(
            user_agent="Comment Extraction",
            client_id=REDDIT_APP_ID,
            client_secret=REDDIT_APP_SECRET,
            username=REDDIT_USERNAME,
            password=REDDIT_PASSWORD,
        )
        self.subreddit: praw.models.Subreddit = self.reddit.subreddit("all")
        self.start_time = start_time
        self.end_time = end_time

    def calculate_perception(self, stock_ticker: str) -> float:
        messages: list[Message] = self.get_messages(stock_ticker)
        total_sum: float = 0
        perception: float = 0
        for message in messages:
            perception += (message.popularity + 1) * message.perception
            total_sum += (message.popularity + 1)
        
        if total_sum > 10000:
            value: float = 1
        elif total_sum == 0:
            return 0,0
        else:
            value: float = total_sum / 10000
        
        perception = perception / total_sum
        return perception, value

    def get_messages(self, company_name: str) -> list[Message]:
        messages: list[Message] = []
        for submission in self.subreddit.search(
            query=f"{company_name} stock", sort="relevance", time_filter="year"
        ):
            perception: float = relative_calculate_perception(submission.title)
            message: Message = Message(perception, submission.score, "Reddit", submission.title)
            messages.append(message)

        messages.sort(key=lambda x: x.perception)
        self.top_titles: list[str] = [message.content for message in messages[-3:]]
        self.bottom_titles: list[str] = [message.content for message in messages[:3]]

        return messages
