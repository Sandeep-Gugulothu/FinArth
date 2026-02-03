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

load_dotenv()

app = Flask(__name__)

# Middleware
CORS(app)

# Routes
app.register_blueprint(plans_blue_print, url_prefix='/api/plans')
app.register_blueprint(health_blue_print, url_prefix='/api/health')
app.register_blueprint(users_blue_print, url_prefix='/api/users')
app.register_blueprint(db_blue_print, url_prefix='/api/db')
app.register_blueprint(portfolio_blue_print, url_prefix='/api/portfolio')
app.register_blueprint(agent_blue_print, url_prefix='/api/agent')

# Root route
@app.route('/')
def root():
    return jsonify({'message': 'FinArth Backend API', 'status': 'running'})

if __name__ == '__main__':
    app.run(debug=True)