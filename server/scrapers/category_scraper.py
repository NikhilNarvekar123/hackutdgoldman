import os
import sys

sys.path.append(os.path.realpath('..'))
from mongo import Mongo

class CategoryScraper:

    @classmethod
    def read_all_tickers(cls):
        # Retrieve all documents from the stock_collection
        documents = list(Mongo.stock_collection.find())
        
        # Extract tickers and overall ratings into a list of tuples
        ticker_rating_tuples = [(doc["ticker"], (0 if not doc["stock_info"]["market_cap"] else doc["stock_info"]["market_cap"])) for doc in documents]
        sorted_ticker_rating_tuples = sorted(ticker_rating_tuples, key=lambda x: x[1], reverse=True)

        sorted_tickers = [tup[0] for tup in sorted_ticker_rating_tuples]
        return sorted_tickers

    @classmethod
    def get_ratings(cls, tickers):
        industries: dict[str, list] = {}
        for ticker in tickers:
            print(f"Scraping {ticker}")
            found_stock = Mongo.stock_collection.find_one({"ticker": ticker})
            industry = found_stock["industry"]
            stock_info = found_stock["stock_info"]
            history = found_stock["history"]

            found_earnings = Mongo.earnings_collection.find_one({"ticker": ticker})
            if not found_earnings:
                continue

            if industry not in industries:
                industries[industry] = {
                    "perceptions": [],
                    "popularity": [],
                    "overall_rating": [],

                    "companies": [],

                    "history": {
                        "perception": [],
                        "popularity": [],
                        "overall_rating": [],
                        
                        "cosine_scores": [],
                        "jaccard_scores": [],
                        "cosine_dist_scores": []
                    }
                }
            
            industries[industry]["perceptions"].append(stock_info["perception"])
            industries[industry]["popularity"].append(stock_info["popularity"])
            industries[industry]["overall_rating"].append(stock_info["overall_rating"])
            industries[industry]["companies"].append(ticker)
            
            industries[industry]["history"]["perception"].append(
                list(entry["perception"] for entry in history["stock_analysis"])
            )
            industries[industry]["history"]["popularity"].append(
                list(entry["popularity"] for entry in history["stock_analysis"])
            )
            industries[industry]["history"]["overall_rating"].append(
                list(entry["overall_rating"] for entry in history["stock_analysis"])
            )

            industries[industry]["history"]["cosine_scores"].append(found_earnings["cosine_scores"])
            industries[industry]["history"]["jaccard_scores"].append(found_earnings["jaccard_scores"])
            industries[industry]["history"]["cosine_dist_scores"].append(found_earnings["cosine_dist_scores"])

            
        return industries

    @classmethod
    def calculate_average_ratings(cls, ratings):
        # Average every list in each industry
        for industry in ratings:
            ratings[industry]["perceptions"] = sum(ratings[industry]["perceptions"]) / len(ratings[industry]["perceptions"])
            ratings[industry]["popularity"] = sum(ratings[industry]["popularity"]) / len(ratings[industry]["popularity"])
            ratings[industry]["overall_rating"] = sum(ratings[industry]["overall_rating"]) / len(ratings[industry]["overall_rating"])

            for key in ratings[industry]["history"]:
                ratings[industry]["history"][key] = [sum(lst) / len(lst) for lst in zip(*ratings[industry]["history"][key])]
        return ratings
            


    @classmethod
    def populate(cls):
        tickers = cls.read_all_tickers()
        ratings = cls.get_ratings(tickers)
        # ratings = cls.get_ratings(["META", "GOOGL"])
        industry_ratings = cls.calculate_average_ratings(ratings)
        industry_ratings = dict(sorted(industry_ratings.items(), key=lambda x: x[1]['overall_rating'], reverse=True))
        
        for key, value in industry_ratings.items():
            Mongo.industry_collection.update_one(
                {"industry": key},
                {"$set": value},
                upsert=True
            )
        return True

            
if __name__ == "__main__":
    CategoryScraper.populate()