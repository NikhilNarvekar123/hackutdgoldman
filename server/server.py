# Make a flask server
import sqlite3
from typing import Tuple, Dict, List
from flask import Flask, request
from scraper import Scraper
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config["DEBUG"] = True
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/")
def home():
    return "Routes: /"

if __name__ == "__main__":
    app.run()