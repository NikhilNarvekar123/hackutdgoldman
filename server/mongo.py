from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from util.config import Config

MONGO_URI = Config.MONGO_URI

DATABASE_NAME = "stock_database"
COLLECTION_NAME = "stocks"

class Mongo:
    client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]

    @classmethod
    def drop(cls) -> bool:
        cls.collection.drop()
        return True
    
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