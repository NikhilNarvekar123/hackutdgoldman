import os
import sys

import pandas as pd
from fredapi import Fred

sys.path.append(os.path.realpath('..'))
from util.config import Config
from mongo import Mongo

FRED_API_KEY = Config.FRED_API_KEY

class EconomicScraper:
    fred = Fred(api_key=FRED_API_KEY)

    @classmethod
    def get_monthly_data(cls, series_id, observation_start, observation_end):
        data = cls.fred.get_series(series_id, observation_start, observation_end, frequency='m')
        return data

    @classmethod
    def normalize(cls, df):
        return (df - df.min()) / (df.max() - df.min())

    @classmethod
    def populate(cls):
        start_date = '2022-11-01'
        end_date = '2023-10-01'
        
        producer_price_index = cls.get_monthly_data('PCUOMFGOMFG', observation_start=start_date, observation_end=end_date)
        consumer_sentiment = cls.get_monthly_data('UMCSENT', observation_start=start_date, observation_end=end_date)
        financial_stress = cls.get_monthly_data('KCFSI', observation_start=start_date, observation_end=end_date)
        snp500 = cls.get_monthly_data('SP500', start_date, end_date)
        
        normalized_producer_price_index = cls.normalize(producer_price_index)
        normalized_consumer_sentiment = cls.normalize(consumer_sentiment)
        normalized_financial_stress = cls.normalize(financial_stress)
        normalized_snp500 = cls.normalize(snp500)
        
        normalized_df = pd.DataFrame({
            'Producer Price Index': normalized_producer_price_index,
            'Consumer Sentiment': normalized_consumer_sentiment,
            'Financial Stress': normalized_financial_stress,
            'S&P 500': normalized_snp500
        })
        
        average_df = normalized_df.mean(axis=1)

        producer_price_index_list = producer_price_index.iloc[::-1].tolist()
        consumer_sentiment_list = consumer_sentiment.iloc[::-1].tolist()
        financial_stress_list = financial_stress.iloc[::-1].tolist()
        snp500_list = snp500.iloc[::-1].tolist()
        average_df_list = average_df.iloc[::-1].tolist()

        insertions = {
            'producer_price_index': producer_price_index_list,
            'consumer_sentiment': consumer_sentiment_list,
            'financial_stress': financial_stress_list,
            'snp500': snp500_list,
            'average': average_df_list
        }
        
        for name, list in insertions.items():
            query = { 'name': name }
            update = { '$set': { 'data': list } }
            Mongo.econ_collection.update_one(query, update, upsert=True)

if __name__ == "__main__":
    EconomicScraper.populate()
