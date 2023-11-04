# Make a flask server
import sqlite3
from typing import Tuple, Dict, List
# from flask import Flask, request
from scraper import Scraper
from flask_cors import CORS, cross_origin

# app = Flask(__name__)
# app.config["DEBUG"] = True
# cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'


from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware

from util.response_model import ResponseModel

app: FastAPI = FastAPI()

API_V1_ENDPOINT = "/api/v1"

# Set up CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# @app.route("/")
# def home():
#     return "Routes: /api/v1/scraper, /api/v1/stock, /api/v1/leaderboard"

@app.get("/", response_model=ResponseModel)
async def default():
    return ResponseModel(success=True, message={"Routes": "/api/v1/scraper, /api/v1/stock, /api/v1/leaderboard"})

# Post request to call scraper
# @app.route("/api/v1/scraper", methods=["POST"])
# def scraper() -> Dict[str, bool]:
#     populated: bool = Scraper.populate_database()
#     return {"success": populated}

@app.post("/api/v1/scraper")
def scraper() -> dict[str, bool]:
    populated: bool = Scraper.populate_database()
    return ResponseModel(success=True, message={"success": populated})

# @app.route("/api/v1/stock", methods=["GET"])
# def stock() -> Dict[str, str]:
#     ticker: str = request.args.get("ticker")
#     conn: sqlite3.Connection = sqlite3.connect("local.db")
#     cursor: sqlite3.Cursor = conn.cursor()
#     cursor.execute("SELECT * FROM stocks WHERE ticker = ?", (ticker,))

#     if row := cursor.fetchone():
#         column_names = [column[0] for column in cursor.description]
#         data: Dict[str, str] = dict(zip(column_names, row))
#         data['success'] = True
#         return data
#     else:
#         return {"success": False}
def get_db_connection():
    conn = sqlite3.connect("local.db")
    try:
        yield conn
    finally:
        conn.close()

@app.get("/api/v1/stock")
def stock(ticker: str, conn: sqlite3.Connection = Depends(get_db_connection)) -> Dict[str, str]:
    cursor: sqlite3.Cursor = conn.cursor()
    cursor.execute("SELECT * FROM stocks WHERE ticker = ?", (ticker,))

    if row := cursor.fetchone():
        column_names = [column[0] for column in cursor.description]
        data: Dict[str, str] = dict(zip(column_names, row))
        data['success'] = True
        return ResponseModel(success=True, message=data)
    else:
        return ResponseModel(success=False, message="404: Stock not found")
    
# @app.route("/api/v1/leaderboard", methods=["GET"])
# def leaderboard() -> Dict[str, str]:
#     conn: sqlite3.Connection = sqlite3.connect("local.db")
#     cursor: sqlite3.Cursor = conn.cursor()
    
#     # Top 5 perception
#     cursor.execute("SELECT * FROM stocks ORDER BY perception DESC LIMIT 5")
#     top_5_perception: List[Tuple[str, float]] = cursor.fetchall()

#     # Bottom 5 perception
#     cursor.execute("SELECT * FROM stocks ORDER BY perception ASC LIMIT 5")
#     bottom_5_perception: List[Tuple[str, float]] = cursor.fetchall()

#     # Top 5 overall rating
#     cursor.execute("SELECT * FROM stocks ORDER BY overall_rating DESC LIMIT 5")
#     top_5_overall_rating: List[Tuple[str, float]] = cursor.fetchall()

#     column_names: List[str] = [column[0] for column in cursor.description]
    
#     data: Dict[str, str] = {
#         "success": True,
#         "top_5_perception": [dict(zip(column_names, row)) for row in top_5_perception],
#         "bottom_5_perception": [dict(zip(column_names, row)) for row in bottom_5_perception],
#         "top_5_overall_rating": [dict(zip(column_names, row)) for row in top_5_overall_rating],
#     }
#     return data

@app.get("/api/v1/leaderboard")
def leaderboard(conn: sqlite3.Connection = Depends(get_db_connection)) -> Dict[str, List[Dict]]:
    cursor: sqlite3.Cursor = conn.cursor()
    
    # Top 5 perception
    cursor.execute("SELECT * FROM stocks ORDER BY perception DESC LIMIT 5")
    top_5_perception: List[Tuple] = cursor.fetchall()

    # Bottom 5 perception
    cursor.execute("SELECT * FROM stocks ORDER BY perception ASC LIMIT 5")
    bottom_5_perception: List[Tuple] = cursor.fetchall()

    # Top 5 overall rating
    cursor.execute("SELECT * FROM stocks ORDER BY overall_rating DESC LIMIT 5")
    top_5_overall_rating: List[Tuple] = cursor.fetchall()

    if cursor.description:
        column_names: List[str] = [column[0] for column in cursor.description]
    else:
        return ResponseModel(success=False, message="500: Failed to get column names from the database")

    data: Dict[str, List[Dict]] = {
        "success": True,
        "top_5_perception": [dict(zip(column_names, row)) for row in top_5_perception],
        "bottom_5_perception": [dict(zip(column_names, row)) for row in bottom_5_perception],
        "top_5_overall_rating": [dict(zip(column_names, row)) for row in top_5_overall_rating],
    }
    
    return ResponseModel(success=True, message=data)


if __name__ == "__main__":
    app.run()