"""
File Name: db.py
Description: This file contains the code for database related operations.
Author Name: The FinArth Team
Creation Date: 02-Feb-2026

Instructions to run: [TODO]

File Execution State: Validation is in progress
"""
from flask import Blueprint, jsonify
from database import db

db_blue_print = Blueprint('db', __name__)

@db_blue_print.route('/', methods=['GET'])
def database_viewer():
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>FinArth Database Viewer</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f4; }
            .container { max-width: 1200px; margin: 0 auto; }
            .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            h1 { color: #1c1917; border-bottom: 3px solid #1c1917; padding-bottom: 10px; }
            h2 { color: #44403c; border-bottom: 2px solid #e7e5e4; padding-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e7e5e4; }
            th { background-color: #f5f5f4; font-weight: bold; color: #1c1917; }
            tr:hover { background-color: #fafaf9; }
            .refresh-btn { background: #1c1917; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 20px; }
            .refresh-btn:hover { background: #292524; }
            .empty { color: #78716c; font-style: italic; }
            .badge { background: #e7e5e4; color: #44403c; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .badge.verified { background: #dcfce7; color: #166534; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📊 FinArth Database Viewer</h1>
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Data</button>
            
            <div class="section">
                <h2>👥 Users</h2>
                <div id="users-table">Loading...</div>
            </div>
            
            <div class="section">
                <h2>💰 User Investments</h2>
                <div id="investments-table">Loading...</div>
            </div>
            
            <div class="section">
                <h2>🎯 User Objectives</h2>
                <div id="objectives-table">Loading...</div>
            </div>
            
            <div class="section">
                <h2>📈 Portfolio Holdings</h2>
                <div id="portfolio-table">Loading...</div>
            </div>

            <div class="section">
                <h2>🎯 Financial Goals</h2>
                <div id="goals-table">Loading...</div>
            </div>

            <div class="section">
                <h2>💬 Chat Sessions</h2>
                <div id="sessions-table">Loading...</div>
            </div>

            <div class="section">
                <h2>✉️ Recent Chat Messages</h2>
                <div id="messages-table">Loading...</div>
            </div>
        </div>

        <script>
            async function loadData() {
                try {
                    const [users, investments, objectives, portfolio, goals, sessions, messages] = await Promise.all([
                        fetch('/api/db/users').then(r => r.json()),
                        fetch('/api/db/investments').then(r => r.json()),
                        fetch('/api/db/objectives').then(r => r.json()),
                        fetch('/api/db/portfolio').then(r => r.json()),
                        fetch('/api/db/goals').then(r => r.json()),
                        fetch('/api/db/sessions').then(r => r.json()),
                        fetch('/api/db/messages').then(r => r.json())
                    ]);

                    // Render users table
                    const usersHtml = users.length ? `
                        <table>
                            <tr>
                                <th>ID</th><th>Email</th><th>Name</th><th>Country</th><th>Age</th>
                                <th>Risk Preference</th><th>Return Estimate</th><th>Verified</th><th>Created</th>
                            </tr>
                            ${users.map(user => `
                                <tr>
                                    <td>${user.id}</td>
                                    <td>${user.email}</td>
                                    <td>${user.name || '<span class="empty">Not set</span>'}</td>
                                    <td>${user.country || '<span class="empty">Not set</span>'}</td>
                                    <td>${user.age || '<span class="empty">Not set</span>'}</td>
                                    <td>${user.risk_preference || '<span class="empty">Not set</span>'}</td>
                                    <td>${user.return_estimate || '<span class="empty">Not set</span>'}</td>
                                    <td><span class="badge ${user.email_verified ? 'verified' : ''}">${user.email_verified ? 'Yes' : 'No'}</span></td>
                                    <td>${new Date(user.created_at).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </table>
                    ` : '<p class="empty">No users found</p>';

                    // Render investments table
                    const investmentsHtml = investments.length ? `
                        <table>
                            <tr><th>ID</th><th>User ID</th><th>Investment Type</th></tr>
                            ${investments.map(inv => `
                                <tr>
                                    <td>${inv.id}</td>
                                    <td>${inv.user_id}</td>
                                    <td>${inv.investment_type}</td>
                                </tr>
                            `).join('')}
                        </table>
                    ` : '<p class="empty">No investments found</p>';

                    // Render objectives table
                    const objectivesHtml = objectives.length ? `
                        <table>
                            <tr><th>ID</th><th>User ID</th><th>Objective</th></tr>
                            ${objectives.map(obj => `
                                <tr>
                                    <td>${obj.id}</td>
                                    <td>${obj.user_id}</td>
                                    <td>${obj.objective}</td>
                                </tr>
                            `).join('')}
                        </table>
                    ` : '<p class="empty">No objectives found</p>';

                    // Render portfolio table
                    const portfolioHtml = portfolio.length ? `
                        <table>
                            <tr><th>ID</th><th>User</th><th>Name</th><th>Category</th><th>Amount</th><th>Date</th><th>Symbol</th><th>Entry Price</th><th>Created</th></tr>
                            ${portfolio.map(holding => `
                                <tr>
                                    <td>${holding.id}</td>
                                    <td>${holding.user_id}</td>
                                    <td>${holding.name}</td>
                                    <td><span class="badge">${holding.category}</span></td>
                                    <td>₹${holding.amount.toLocaleString()}</td>
                                    <td>${holding.date}</td>
                                    <td>${holding.symbol || '<span class="empty">None</span>'}</td>
                                    <td>${holding.entry_price ? '₹' + holding.entry_price.toLocaleString() : '<span class="empty">Fetch Pending</span>'}</td>
                                    <td>${new Date(holding.created_at).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </table>
                    ` : '<p class="empty">No portfolio holdings found</p>';

                    // Render goals table
                    const goalsHtml = goals.length ? `
                        <table>
                            <tr><th>ID</th><th>User</th><th>Name</th><th>Target</th><th>Current</th><th>Years</th><th>Monthly</th><th>Status</th><th>Updated</th></tr>
                            ${goals.map(goal => `
                                <tr>
                                    <td>${goal.id}</td>
                                    <td>${goal.user_id}</td>
                                    <td>${goal.name}</td>
                                    <td>₹${goal.target_amount.toLocaleString()}</td>
                                    <td>₹${goal.current_amount.toLocaleString()}</td>
                                    <td>${goal.timeline_years}y</td>
                                    <td>₹${goal.monthly_required.toLocaleString()}</td>
                                    <td><span class="badge ${goal.status === 'on-track' ? 'verified' : ''}">${goal.status}</span></td>
                                    <td>${new Date(goal.updated_at).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </table>
                    ` : '<p class="empty">No financial goals found</p>';

                    // Render sessions table
                    const sessionsHtml = sessions.length ? `
                        <table>
                            <tr><th>ID</th><th>User</th><th>Title</th><th>Updated</th></tr>
                            ${sessions.map(s => `
                                <tr>
                                    <td><small>${s.id}</small></td>
                                    <td>${s.user_id}</td>
                                    <td>${s.title || '<span class="empty">Untitled</span>'}</td>
                                    <td>${new Date(s.updated_at).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </table>
                    ` : '<p class="empty">No chat sessions found</p>';

                    // Render messages table
                    const messagesHtml = messages.length ? `
                        <table>
                            <tr><th>ID</th><th>Session</th><th>Role</th><th>Content Preview</th><th>Timestamp</th></tr>
                            ${messages.map(m => `
                                <tr>
                                    <td>${m.id}</td>
                                    <td><small>${m.session_id}</small></td>
                                    <td><span class="badge">${m.role}</span></td>
                                    <td>${m.content ? m.content.substring(0, 50) + '...' : ''}</td>
                                    <td>${new Date(m.timestamp).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </table>
                    ` : '<p class="empty">No chat messages found</p>';

                    document.getElementById('users-table').innerHTML = usersHtml;
                    document.getElementById('investments-table').innerHTML = investmentsHtml;
                    document.getElementById('objectives-table').innerHTML = objectivesHtml;
                    document.getElementById('portfolio-table').innerHTML = portfolioHtml;
                    document.getElementById('goals-table').innerHTML = goalsHtml;
                    document.getElementById('sessions-table').innerHTML = sessionsHtml;
                    document.getElementById('messages-table').innerHTML = messagesHtml;
                } catch (error) {
                    console.error('Error loading data:', error);
                    document.body.innerHTML += '<div style="color: red; margin: 20px;">Error loading data. Make sure the backend is running.</div>';
                }
            }

            loadData();
        </script>
    </body>
    </html>
    """
    return html

@db_blue_print.route('/users', methods=['GET'])
def get_users():
    try:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()
        return jsonify([dict(user) for user in users])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@db_blue_print.route('/investments', methods=['GET'])
def get_investments():
    try:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM user_investments")
        investments = cursor.fetchall()
        return jsonify([dict(investment) for investment in investments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@db_blue_print.route('/objectives', methods=['GET'])
def get_objectives():
    try:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM user_objectives")
        objectives = cursor.fetchall()
        return jsonify([dict(objective) for objective in objectives])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@db_blue_print.route('/portfolio', methods=['GET'])
def get_portfolio():
    try:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM portfolio_holdings ORDER BY created_at DESC")
        portfolio = cursor.fetchall()
        return jsonify([dict(holding) for holding in portfolio])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@db_blue_print.route('/goals', methods=['GET'])
def get_goals():
    try:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM financial_goals ORDER BY created_at DESC")
        goals = cursor.fetchall()
        return jsonify([dict(goal) for goal in goals])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@db_blue_print.route('/sessions', methods=['GET'])
def get_sessions():
    try:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM chat_sessions ORDER BY updated_at DESC")
        sessions = cursor.fetchall()
        return jsonify([dict(session) for session in sessions])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@db_blue_print.route('/messages', methods=['GET'])
def get_messages():
    try:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM chat_messages ORDER BY timestamp DESC LIMIT 100")
        messages = cursor.fetchall()
        return jsonify([dict(msg) for msg in messages])
    except Exception as e:
        return jsonify({'error': str(e)}), 500