import os
import sys
from bs4 import BeautifulSoup
import requests
import json
import time
from similarity_scores import cosine_similarity_score, jaccard_similarity_score, cosine_distance_score

import datetime
import pandas as pd

sys.path.append(os.path.realpath('..'))
from stock import Stock
from mongo import Mongo
from concurrent.futures import ThreadPoolExecutor, as_completed

DATABASE_NAME = "stock_database"
COLLECTION_NAME = "earnings"

# https://www.sec.gov/include/ticker.txt
# Load the ticker to CIK mapping
ticker_to_cik = {}
with open("resources/ticker.txt", "r") as f:
    for line in f:
        ticker, cik = line.split()
        ticker_to_cik[ticker] = cik

def get_cache_location(ticker: str):
    # Get the absolute path to the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Specify the relative directory name
    relative_folder_name = f"cached_earnings_reports/{ticker}"

    # Construct the absolute path
    return os.path.join(script_dir, relative_folder_name)

def get_single_html(_id: str, period_ending: str, ticker: str):
    # convert stuff in the format of 0000320193-23-000106:aapl-20230930.htm into https://www.sec.gov/Archives/edgar/data/320193/000032019323000106/aapl-20230930.htm
    part_1, part_2 = _id.split(':')
    cik_padded, year, thingie = part_1.split('-')

    url = f"https://www.sec.gov/Archives/edgar/data/{cik_padded.lstrip('0')}/{cik_padded}{year}{thingie}/{part_2}"
    # print(url)

    headers = {
        'authority': 'efts.sec.gov',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'origin': 'https://www.sec.gov',
        'pragma': 'no-cache',
        'referer': 'https://www.sec.gov/',
        'sec-ch-ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
                    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36')
    }
    response = requests.get(url, headers=headers)

    # write reponse.txt to cache
    cache_location = get_cache_location(ticker)
    if not os.path.exists(cache_location):
        os.makedirs(cache_location)
    with open(f"{cache_location}/{period_ending}.html", 'w') as f:
        f.write(response.text)

def generate_cache_for_ticker(ticker: str):
    if ticker not in ticker_to_cik:
        print(f"ticker {ticker} not in ticker_to_cik")
        return
    cik = ticker_to_cik[ticker]
    # pad cik with zeros before it if it's less than 10 long
    cik = cik.zfill(10)

    # Define the base URL
    base_url = "https://efts.sec.gov/LATEST/search-index"

    # Define the parameters for the GET request
    all_forms: str = '1-K,1-SA,1-U,1-Z,1-Z-W,10-D,10-K,10-KT,10-Q,10-QT,11-K,11-KT,13F-HR,13F-NT,15-12B,15-12G,15-15D,15F-12B,15F-12G,15F-15D,18-K,20-F,24F-2NT,25,25-NSE,40-17F2,40-17G,40-F,6-K,8-K,8-K12G3,8-K15D5,ABS-15G,ABS-EE,ANNLRPT,DSTRBRPT,IRANNOTICE,N-30B-2,N-30D,N-CEN,N-CSR,N-CSRS,N-MFP,N-MFP1,N-MFP2,N-PX,N-Q,NPORT-EX,NSAR-A,NSAR-B,NSAR-U,NT 10-D,NT 10-K,NT 10-Q,NT 11-K,NT 20-F,QRTLYRPT,SD,SP 15D2'
    params = {
        'category': 'form-cat1',
        'ciks': cik,
        'forms': '10-K,10-Q', # '10-K,8-K'
        'startdt': '2022-09-01',
        'enddt': '2023-11-04'
    }

    # Define the headers as a dictionary
    headers = {
        'authority': 'efts.sec.gov',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'origin': 'https://www.sec.gov',
        'pragma': 'no-cache',
        'referer': 'https://www.sec.gov/',
        'sec-ch-ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
                    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36')
    }

    # Make the GET request
    response = requests.get(base_url, headers=headers, params=params)

    # Check if the request was successful
    if response.status_code == 200:
        # Convert the response to JSON format and pretty print it
        response_json = json.loads(response.text)
        period_endings_list = ["2023-07-01", "2023-04-01", "2022-12-31", "2023-09-30", "2022-09-24"]
        forms_list = ["10-Q", "10-K"]

        for hit in response_json['hits']['hits']:
            #  or hit["_source"]["period_ending"] not in period_endings_list
            if hit["_source"]["form"] not in forms_list:
                continue
            get_single_html(hit['_id'], hit["_source"]["period_ending"], ticker)
    else:
        print(f"Request failed with status code {response.status_code}")

def generate_scores(ticker: str, just_gen_cache = False):
    ticker = ticker.lower()
    # print(f"generate_scores for {ticker}")
    # cached_earning_reports/ticker/period -> html

    # check if current ticker is in the cache
    if os.path.exists(get_cache_location(ticker)):
        print(f"cache found for {ticker}")
    else:
        print(f"no cache found for {ticker}, generating cache")
        generate_cache_for_ticker(ticker)

        # sleep for 10 seconds so sec doesn't rate limit us?
        time.sleep(5)
    
    # get all of the files in the directory, they're already sorted
    cache_location = get_cache_location(ticker)
    files = os.listdir(cache_location)
    files.sort()

    # parse the html with beautiful soup
    cache_location = get_cache_location(ticker)
    period_endings_parsed = []
    for file in files:
        html_text = open(os.path.join(cache_location, file), "r").read()
        period_endings_parsed.append(BeautifulSoup(html_text, "lxml").get_text(separator='\n', strip=True))

    list_of_12 = []
    for i in range(len(files) - 1):
        cosine_score = cosine_similarity_score(period_endings_parsed[i], period_endings_parsed[i+1])
        jaccard_score = jaccard_similarity_score(period_endings_parsed[i], period_endings_parsed[i+1])
        cosine_dist_score = cosine_distance_score(period_endings_parsed[i], period_endings_parsed[i+1])

        combined_object = {"cosine_score": cosine_score, "jaccard_score": jaccard_score, "cosine_dist_score": cosine_dist_score}
        for _ in range(3):
            list_of_12.append(combined_object)
    
    # fallback
    if not list_of_12:
        return {
            "cosine_score": [1] * 12,
            "jaccard_score": [1] * 12,
            "cosine_dist_score": [1] * 12
        }
    
    # convert list_of_12 to 3 lists instead of 1 list of 12
    list_of_12 = list_of_12[::-1]

    while len(list_of_12) < 12:
        list_of_12.append(list_of_12[-1])

    cosine_scores = [x["cosine_score"] for x in list_of_12]
    jaccard_scores = [x["jaccard_score"] for x in list_of_12]
    cosine_dist_scores = [x["cosine_dist_score"] for x in list_of_12]

    return {
        "cosine_scores": cosine_scores,
        "jaccard_scores": jaccard_scores,
        "cosine_dist_scores": cosine_dist_scores
    }

class EarningsScraper:

    @classmethod
    def populate_database(cls, overwrite: bool = False) -> bool:
        tickers: list[tuple[str, str]] = cls.get_sp500_tickers_and_industries()
        top_10_sp500_tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "JNJ", "UNH", "META", "V"]
        # tickers = [ticker for ticker in tickers if ticker[0] in top_10_sp500_tickers]

        # if overwrite:
        #     Mongo.drop()

        def process_ticker(ticker: str, industry: str, sub_industry: str) -> None:
            if not overwrite and Mongo.earnings_collection.find_one({"ticker": ticker}):
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
        lazy_prices_metrics = generate_scores(stock_ticker)
        lazy_prices_metrics['ticker'] = stock_ticker

        Mongo.earnings_collection.replace_one({"ticker": stock_ticker}, lazy_prices_metrics, upsert=True)

    @classmethod
    def get_sp500_tickers_and_industries(cls) -> list[tuple[str, str, str]]:
        table: pd.DataFrame = pd.read_html('https://en.wikipedia.org/wiki/list_of_S%26P_500_companies')
        table = table[0]
        ticker_info: list[tuple[str, str, str]] = list(zip(table['Symbol'], table['GICS Sector'], table['GICS Sub-Industry']))

        return ticker_info

if __name__ == "__main__":
    print(len(ticker_to_cik))
    EarningsScraper.populate_database(overwrite=False)