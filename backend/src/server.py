import os
from app import app

PORT = os.getenv('PORT', 8000)

# For Vercel deployment
app.config['ENV'] = 'production'
app.config['DEBUG'] = False

if __name__ == '__main__':
    print(f'Backend server running on http://localhost:{PORT}')
    app.run(host='0.0.0.0', port=int(PORT), debug=True)
else:
    # This is for Vercel
    application = app