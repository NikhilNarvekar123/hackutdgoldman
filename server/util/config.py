import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    POLYGON_API_KEY = os.getenv('POLYGON_API_KEY')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

    NEWS_API_KEY = os.getenv('NEWS_API_KEY')

    MONGO_URI = os.getenv('MONGO_URI')

    YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

    REDDIT_USERNAME = os.getenv('REDDIT_USERNAME')
    REDDIT_PASSWORD = os.getenv('REDDIT_PASSWORD')
    REDDIT_APP_ID = os.getenv('REDDIT_APP_ID')
    REDDIT_APP_SECRET = os.getenv('REDDIT_APP_SECRET')

    FRED_API_KEY = os.getenv('FRED_API_KEY')

    ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')