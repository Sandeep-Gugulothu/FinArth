import os
from app import app

PORT = os.getenv('PORT', 8000)

if __name__ == '__main__':
    print(f'Backend server running on http://localhost:{PORT}')
    app.run(host='0.0.0.0', port=int(PORT), debug=True)