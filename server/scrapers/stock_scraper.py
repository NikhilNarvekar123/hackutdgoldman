import os
import sys
import datetime
import pandas as pd

sys.path.append(os.path.realpath('..'))
from stock import Stock
from mongo import Mongo
from concurrent.futures import ThreadPoolExecutor, as_completed

DATABASE_NAME = "stock_database"
COLLECTION_NAME = "stocks"

class StockScraper:

    @classmethod
    def populate_database(cls, overwrite: bool = False) -> bool:
        tickers: list[tuple[str, str]] = cls.get_sp500_tickers_and_industries()
        top_10_sp500_tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "JNJ", "UNH", "META", "V"]
        # tickers = [ticker for ticker in tickers if ticker[0] in top_10_sp500_tickers]

        # if overwrite:
        #     Mongo.drop()

        def process_ticker(ticker: str, industry: str, sub_industry: str) -> None:
            if not overwrite and Mongo.stock_collection.find_one({"ticker": ticker}):
                return
            # try:
            cls.send_to_database(ticker, industry, sub_industry)
            # except Exception as e:
            #     print(e)
            #     print(f"Unable to write stock info for {ticker}")
        
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_ticker = {executor.submit(process_ticker, ticker, industry, sub_industry): ticker for ticker, industry, sub_industry in tickers}
            
            for future in as_completed(future_to_ticker):
                ticker = future_to_ticker[future]
                try:
                    future.result()
                except Exception as exc:
                    print(f"{ticker} generated an exception: {exc}")

        return True

    @classmethod
    def send_to_database(cls, stock_ticker: str, industry: str, sub_industry: str) -> None:
        stock: Stock = Stock(stock_ticker)
        stock.populate()
        print(stock_ticker)
        
        historical_data: list = stock.stock_history
        closing_prices = historical_data["indicators"]["adjclose"][0]["adjclose"]
        volumes = historical_data["indicators"]["quote"][0]["volume"]

        start_date = datetime.datetime(2022, 11, 1)
        end_date = datetime.datetime(2023, 11, 1)
        
        current_date = start_date
        stock_analysis = []
        while current_date < end_date:
            print(f"Current date: {current_date}")
            temp_analysis = stock.perform_analysis(needs_blurb=True, month=current_date.month, year=current_date.year)
            stock_analysis.append({
                "perception": temp_analysis["perception"],
                "popularity": temp_analysis["popularity"],
                "overall_rating": temp_analysis["overall_rating"],
            })
            

            current_date += datetime.timedelta(days=31)

        stock_info = {
            "ticker": stock_ticker,
            "name": stock.name,
            "industry": industry,
            "sub_industry": sub_industry,

            "stock_info": {
                "market_cap": stock.market_cap,
                "description": stock.description,
                "similar": stock.similar,
                "current_price": stock.current_price,
                "growth": stock.growth,
                "recommend": stock.recommend,
                "blurb": stock.blurb,
                "logo_url": stock.logo,
                "analyst_count": stock.analyst_count,
                "perception": stock.perception,
                "popularity": stock.popularity,
                "overall_rating": stock.overall_rating,
                "titles": stock.titles,
            },

            "history": {
                "closing_prices": closing_prices[:12],
                "volumes": volumes[:12],
                "stock_analysis": stock_analysis[:12]
            }
        }
        Mongo.stock_collection.replace_one({"ticker": stock_ticker}, stock_info, upsert=True)

    @classmethod
    def get_sp500_tickers_and_industries(cls) -> list[tuple[str, str, str]]:
        table: pd.DataFrame = pd.read_html('https://en.wikipedia.org/wiki/list_of_S%26P_500_companies')
        table = table[0]
        ticker_info: list[tuple[str, str, str]] = list(zip(table['Symbol'], table['GICS Sector'], table['GICS Sub-Industry']))

        return ticker_info


if __name__ == "__main__":
    # StockScraper.populate_database(overwrite=False)
    pass