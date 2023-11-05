import json

from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware

from util.response_model import ResponseModel
from mongo import Mongo

app: FastAPI = FastAPI()

API_ENDPOINT = "/api"

# Set up CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_model=ResponseModel)
async def default():
    return ResponseModel(success=True, message={"Routes": "/api/v1/scraper, /api/v1/stock, /api/v1/leaderboard"})

@app.get(f"{API_ENDPOINT}/stock", response_model=ResponseModel)
async def stock(ticker: str) -> ResponseModel:
    return ResponseModel(
        success=True,
        message=Mongo.get_stock_info(ticker)
    )

@app.get(f"{API_ENDPOINT}/stock_leaderboard", response_model=ResponseModel)
async def leaderboard():
    return ResponseModel(
        success=True,
        message=Mongo.get_leaderboard()
    )

@app.get(f"{API_ENDPOINT}/top_industries", response_model=ResponseModel)
async def top_industries():
    return ResponseModel(
        success=True,
        message=Mongo.get_top_industries()
    )

if __name__ == "__main__":
    app.run()