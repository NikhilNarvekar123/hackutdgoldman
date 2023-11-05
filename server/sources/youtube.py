from apiclient.discovery import build
from .lib.message import Message
from .lib.perception import relative_calculate_perception
from util.config import Config

YOUTUBE_API_KEY = Config.YOUTUBE_API_KEY


class Youtube:
    def __init__(self, start_time: str, end_time: str):
        self.youtube: build = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
        self.start_time = start_time
        self.end_time = end_time

    def calculate_perception(self, stock_ticker: str) -> float:
        messages: list[Message] = self.get_messages(stock_ticker)
        total_sum: float = 0
        perception: float = 0
        for message in messages:
            perception += (message.popularity + 1) * message.perception
            total_sum += (message.popularity + 1)
        
        if total_sum > 10000000:
            value: float = 1
        else:
            value: float = total_sum / 10000000
        perception = perception / total_sum
        
        return perception, value
    
    def get_messages(self, company_name: str) -> list[Message]:
        messages: list[Message] = []
        titles: list[str] = []
        video_ids: list[str] = []
        titles, video_ids = self._fetch_video_titles_and_ids(f"{company_name} stock")
        video_statistics: list[dict] = self._fetch_video_statistics(video_ids)

        for index, stats in enumerate(video_statistics):
            title: str = titles[index]
            perception: float = relative_calculate_perception(title)
            popularity: int = int(stats["statistics"]["viewCount"])

            if "likeCount" in stats["statistics"]:
                likes: int = int(stats["statistics"]["likeCount"])
                dislikes: int = likes * 0.3  # Temp solution
                like_dislike_ratio: float = self._calculate_like_dislike_ratio(
                    likes, dislikes
                )
            else:
                like_dislike_ratio: float = 1

            perception *= like_dislike_ratio
            message: Message = Message(perception, popularity, "YouTube", title)
            messages.append(message)
        
        self.top_titles: list[str] = [message.content for message in messages[-3:]]
        self.bottom_titles: list[str] = [message.content for message in messages[:3]]

        return messages

    def _fetch_video_titles_and_ids(self, company_name: str) -> (list[str], list[str]):
        title_request: build = self.youtube.search().list(
            q=company_name,
            part="snippet",
            type="video",
            publishedAfter=self.start_time,
            publishedBefore=self.end_time,
            maxResults=100,
        )
        response: dict[str, list[dict]] = title_request.execute()
        titles: list[str] = [item["snippet"]["title"] for item in response["items"]]
        video_ids: list[str] = [item["id"]["videoId"] for item in response["items"]]
        return titles, video_ids

    def _fetch_video_statistics(self, video_ids: list[str]) -> list[dict]:
        ids_str: str = ",".join(video_ids)
        statistics_request = self.youtube.videos().list(
            id=ids_str, part="statistics", maxResults=100
        )
        response: dict[str, list[dict]] = statistics_request.execute()
        return response["items"]

    @staticmethod
    def _calculate_like_dislike_ratio(likes: int, dislikes: int) -> float:
        if dislikes == 0:
            return 1
        return likes / (dislikes + likes)
