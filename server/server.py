import sqlite3
from typing import Tuple, Dict, List
from scraper import Scraper


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

@app.get("/", response_model=ResponseModel)
async def default():
    return ResponseModel(success=True, message={"Routes": "/api/v1/scraper, /api/v1/stock, /api/v1/leaderboard"})


@app.post("/api/v1/scraper")
def scraper() -> dict[str, bool]:
    populated: bool = Scraper.populate_database()
    return ResponseModel(success=True, message={"success": populated})


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