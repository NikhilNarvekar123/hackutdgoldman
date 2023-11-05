import json
from bson import json_util

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from util.config import Config

MONGO_URI = Config.MONGO_URI

DATABASE_NAME = "stock_database"
COLLECTIONS = {
    "STOCKS": "stocks",
    "ECONOMICS": "econ",
    "EARNINGS": "earnings",
    "INDUSTRY": "industry"
}

class Mongo:
    client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
    db = client[DATABASE_NAME]
    stock_collection = db[COLLECTIONS["STOCKS"]]
    econ_collection = db[COLLECTIONS["ECONOMICS"]]
    earnings_collection = db[COLLECTIONS["EARNINGS"]]
    industry_collection = db[COLLECTIONS["INDUSTRY"]]

    def parse_json(data):
        return json.loads(json_util.dumps(data))

    @classmethod
    def drop(cls) -> bool:
        # cls.earnings_collection.drop()
        return True
    
    @classmethod
    def get_stock_info(cls, ticker: str) -> dict[str, any]:
        stock_info = cls.stock_collection.find_one({"ticker": ticker})
        earnings_info = cls.earnings_collection.find_one({"ticker": ticker})
        econ_info = cls.econ_collection.find_one({"name": "average"})

        return {
            "stock": cls.parse_json(stock_info),
            "earnings": cls.parse_json(earnings_info),
            "econ": cls.parse_json(econ_info)
        }
    
    @classmethod
    def get_leaderboard(cls) -> dict[str, any]:
        highest_rated_stocks = list(Mongo.stock_collection.find().sort("stock_info.overall_rating", -1).limit(5))
        lowest_rated_stocks = list(Mongo.stock_collection.find().sort("stock_info.overall_rating", 1).limit(5))
        
        return {
            "highest_rated_stocks": cls.parse_json(highest_rated_stocks),
            "lowest_rated_stocks": cls.parse_json(lowest_rated_stocks)
        }
    
    @classmethod
    def get_top_industries(cls) -> dict[str, any]:
        top_industries = list(Mongo.industry_collection.find().sort("overall_rating", -1).limit(5))
        return {"top_industries": cls.parse_json(top_industries)}

    @classmethod
    def get_industry(cls, industry: str) -> dict[str, any]:
        return {"industry": cls.parse_json(cls.industry_collection.find_one({"industry": industry}))}
    
    @classmethod
    def get_econ_info(cls) -> dict[str, any]:
        return {
            "producer_price_index": cls.parse_json(cls.econ_collection.find_one({"name": "producer_price_index"})),
            "consumer_sentiment": cls.parse_json(cls.econ_collection.find_one({"name": "consumer_sentiment"})),
            "financial_stress": cls.parse_json(cls.econ_collection.find_one({"name": "financial_stress"})),
            "snp500": cls.parse_json(cls.econ_collection.find_one({"name": "snp500"})),
            "average": cls.parse_json(cls.econ_collection.find_one({"name": "average"}))
        }
    
    @classmethod
    def poll(cls) -> None:
        try:
            cls.client.admin.command('ping')
            print("Successfully connected to Mongo")
            return True
        except Exception as e:
            print("Unable to connect to Mongo, error:")
            print(e)
            return False

if __name__ == "__main__":
    Mongo.poll()