import yfinance as yf
import requests
import math
import openai
from difflib import SequenceMatcher

from sources.news import News
from sources.reddit import Reddit
from sources.youtube import Youtube

from util.config import Config
from ticker import Ticker

POLYGON_API_KEY = Config.POLYGON_API_KEY
OPENAI_API_KEY = Config.OPENAI_API_KEY
openai.api_key = OPENAI_API_KEY

class Stock:
    def __init__(self, ticker):
        # Essentials
        self.ticker: str = ticker

        # Details
        self.name: str = None
        self.market_cap: float = None
        self.description: str = None
        self.similar: str = None
        self.current_price: float = None
        self.growth: str = None
        self.recommend: str = None
        self.blurb: str = None
        self.logo_url: str = None
        self.analyst_count: int = None

        # Data
        self.perception: float = None
        self.popularity: int = None
        self.overall_rating: float = None

    def create_blurb(self, stock_data: dict[str, str]) -> str:
        # Delete to save tokens
        stuff_to_delete: list[str] = [
            "longBusinessSummary", "companyOfficers", "uuid", "messageBoardId",
            "address1", "website", "phone", "city", "state", "zip",
            "country", "industry", "gmtOffSetMilliseconds", "governanceEpochDate",
            "timeZoneFullName", "timeZoneShortName",
        ]

        for stuff in stuff_to_delete:
            if stuff in stock_data:
                del stock_data[stuff]
        
        stock_data["name"] = self.name
        
        # return "Insert blurb here"

        response: dict[str, str] = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant designed to take in stock data and return an smart but concise analysis on the market trends. Use and cite quantitative data to determine if the stock is worth buying or not. Every sentence should be a point backed up by data. Provide a single concise paragraph blurb of no more than 150 characters.",
                },
                {
                    "role": "user",
                    "content": str(stock_data),
                }
            ],
            temperature=0.7,
            max_tokens=256,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
        )
        # print(response.choices[0].message.content)
        return response.choices[0].message.content
    
    def perform_analysis(self, needs_blurb=False, month: int=10, year: int=2023) -> dict[str, any]:
        print(f"Performing analysis on {self.name} for {month}/{year}")
        start_time: str = f"{year}-{month}-01T00:00:00.000Z"
        end_time: str = f"{year+1 if month == 12 else year}-{1 if month == 12 else month}-01T00:00:00.000Z"

        reddit: Reddit = Reddit(start_time, end_time)
        news: News = News(start_time, end_time)
        # youtube: Youtube = Youtube(start_time, end_time)

        reddit_perception, reddit_popularity = reddit.calculate_perception(self.name)
        # youtube_perception, youtube_popularity = youtube.calculate_perception(
        #     self.name
        # )
        news_perception, news_popularity = news.calculate_perception(self.name)

        total_popularity: float = (
            (reddit_popularity + news_popularity) / 2
        )
        total_perception: float = (
            (reddit_perception + news_perception) / 2
        ) + 0.2

        def apply_bias(score, bias_factor):
            return score * math.exp(bias_factor * abs(score))

        # Go higher/lower as needed
        BIAS_FACTOR: float = 0.2

        biased_perception = apply_bias(total_perception, BIAS_FACTOR)
        biased_popularity = apply_bias(total_popularity, BIAS_FACTOR)

        overall_rating = (biased_perception + biased_popularity) / 2
        overall_rating = min(max(overall_rating, -0.98), 0.98) # Clamp
        
        perception: float = round(total_perception * 100, 2)
        popularity: float = round(total_popularity * 100, 2)
        overall_rating: float = round(overall_rating * 100, 2)

        top_overall_titles = []
        bottom_overall_titles = []
        if needs_blurb:
            top_overall_titles: list[tuple[str, str]] = [(title, "reddit") for title in reddit.top_titles] + \
                                                        [(title, "news") for title in news.top_titles]
                                                        # [(title, "youtube") for title in youtube.top_titles] + \
                                                        

            bottom_overall_titles: list[tuple[str, str]] = [(title, "reddit") for title in reddit.bottom_titles] + \
                                                        [(title, "news") for title in news.bottom_titles]
                                                        # [(title, "youtube") for title in youtube.bottom_titles] + \
                                                        
            
        def similarity_ratio(a: str, b: str) -> float:
            return SequenceMatcher(a=a.lower(), b=b.lower()).ratio()
        
        top_overall_titles.sort(key=lambda x: similarity_ratio(x[0], self.name), reverse=True)
        bottom_overall_titles.sort(key=lambda x: similarity_ratio(x[0], self.name), reverse=True)

        return {
            "perception": perception,
            "popularity": popularity,
            "overall_rating": overall_rating,
            "titles": {
                "top": top_overall_titles,
                "bottom": bottom_overall_titles
            }
        }
        

    def populate(self):
        if not self.ticker:
            print("Invalid ticker")
            return

        stock_details: dict[str, str] = {}
        stock_data: dict[str, str] = {}
        try:
            stock_details, stock_data, stock_history = self._get_stock_info()
            self.stock_history = stock_history
        except Exception as e:
            print("Unable to get stock info")
            print(e)
            return

        print(f"Retrieving stock info for {self.ticker}") 

        self.name = stock_details.get("name") or self.ticker
        self.market_cap = stock_details.get("marketcap")
        self.similar = stock_details.get("similar")
        self.logo = stock_details.get("logo")
        self.description = stock_details.get("description")

        open_price = stock_data.get("regularMarketOpen")
        close_price = stock_data.get("previousClose")
        self.current_price = stock_data.get("currentPrice")
        self.growth = stock_data.get("revenueGrowth",0) * 100
        self.recommend = stock_data.get("recommendationKey", "Unknown")
        self.analyst_count = stock_data.get("numberOfAnalystOpinions", 0)

        self.blurb = self.create_blurb(stock_data)
        
        analysis: dict[str, any] = self.perform_analysis(needs_blurb=True)
        self.perception = analysis["perception"]
        self.popularity = analysis["popularity"]
        self.overall_rating = analysis["overall_rating"]

        top_overall_titles = analysis["titles"]["top"]
        bottom_overall_titles = analysis["titles"]["bottom"]
        
        # print(top_overall_titles)
        # print(bottom_overall_titles)

        if self.perception > 0:
            majority_role = "positive"
            minority_role = "negative"
            majority_titles = top_overall_titles
            minority_titles = bottom_overall_titles
        else:
            majority_role = "negative"
            minority_role = "positive"
            majority_titles = bottom_overall_titles
            minority_titles = top_overall_titles
        
        titles_to_show: list[dict[str, str]] = [
            {"title": majority_titles[0][0], "source": majority_titles[0][1], "role": majority_role},
            {"title": majority_titles[1][0], "source": majority_titles[1][1], "role": majority_role},
            {"title": minority_titles[0][0], "source": minority_titles[0][1], "role": minority_role},
        ]
        self.titles = titles_to_show


    def _get_stock_info(self) -> dict[str, str]:
        stock_raw: Ticker = Ticker(self.ticker)
        stock_data: dict[str, str] = stock_raw.info
        stock_history = stock_raw.get_historical_data

        response: requests.Response = requests.get(
            f"https://api.polygon.io/v1/meta/symbols/{self.ticker}/company?apiKey={POLYGON_API_KEY}",
        )
        stock_details: dict[str, str] = response.json()
        
        return stock_details, stock_data, stock_history


if __name__ == "__main__":
    stock = Stock("AAPL")
    stock.populate()