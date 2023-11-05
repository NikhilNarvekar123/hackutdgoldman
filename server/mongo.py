from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from util.config import Config

MONGO_URI = Config.MONGO_URI

DATABASE_NAME = "stock_database"
COLLECTIONS = {
    "STOCKS": "stocks",
    "ECONOMICS": "econ",
    "EARNINGS": "earnings",
}

class Mongo:
    client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
    db = client[DATABASE_NAME]
    stock_collection = db[COLLECTIONS["STOCKS"]]
    econ_collection = db[COLLECTIONS["ECONOMICS"]]
    earnings_collection = db[COLLECTIONS["EARNINGS"]]

    @classmethod
    def drop(cls) -> bool:
        # cls.earnings_collection.drop()
        return True
    
    def get_ticker_dict(self, ticker: str) -> dict[str, any]:
        return self.collection.find_one({"ticker": ticker})
    
    
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