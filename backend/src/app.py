from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Import routes
from routes.plans import plans_blue_print
from routes.health import health_blue_print
from routes.users import users_blue_print
from routes.db import db_blue_print
from routes.portfolio import portfolio_blue_print
from routes.agent import agent_blue_print
from routes.market import market_blue_print

load_dotenv()

app = Flask(__name__)

# Enhanced CORS configuration for production
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:3001", 
    "https://*.vercel.app",
    "https://fin-arth-frontend.vercel.app"  # Your actual frontend URL
])

# Routes
app.register_blueprint(plans_blue_print, url_prefix='/api/plans')
app.register_blueprint(health_blue_print, url_prefix='/api/health')
app.register_blueprint(users_blue_print, url_prefix='/api/users')
app.register_blueprint(db_blue_print, url_prefix='/api/db')
app.register_blueprint(portfolio_blue_print, url_prefix='/api/portfolio')
app.register_blueprint(agent_blue_print, url_prefix='/api/agent')
app.register_blueprint(market_blue_print, url_prefix='/api/market')

# Root route
@app.route('/')
def root():
    return jsonify({'message': 'FinArth Backend API', 'status': 'running'})

if __name__ == '__main__':
    app.run(debug=True)