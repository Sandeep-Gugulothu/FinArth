import os
from app import app

PORT = os.getenv('PORT', 5000)

# Production configuration
app.config['ENV'] = 'production'
app.config['DEBUG'] = False

if __name__ == '__main__':
    print(f'Backend server running on port {PORT}')
    app.run(host='0.0.0.0', port=int(PORT), debug=False)