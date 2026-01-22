import express from 'express';
import db from '../database';

const router = express.Router();

// Database viewer endpoint
router.get('/', (req, res) => {
  const html = `
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
        </div>

        <script>
            async function loadData() {
                try {
                    const [users, investments, objectives] = await Promise.all([
                        fetch('/api/db/users').then(r => r.json()),
                        fetch('/api/db/investments').then(r => r.json()),
                        fetch('/api/db/objectives').then(r => r.json())
                    ]);

                    // Render users table
                    const usersHtml = users.length ? \`
                        <table>
                            <tr>
                                <th>ID</th><th>Email</th><th>Name</th><th>Country</th><th>Age</th>
                                <th>Risk Preference</th><th>Return Estimate</th><th>Verified</th><th>Created</th>
                            </tr>
                            \${users.map(user => \`
                                <tr>
                                    <td>\${user.id}</td>
                                    <td>\${user.email}</td>
                                    <td>\${user.name || '<span class="empty">Not set</span>'}</td>
                                    <td>\${user.country || '<span class="empty">Not set</span>'}</td>
                                    <td>\${user.age || '<span class="empty">Not set</span>'}</td>
                                    <td>\${user.risk_preference || '<span class="empty">Not set</span>'}</td>
                                    <td>\${user.return_estimate || '<span class="empty">Not set</span>'}</td>
                                    <td><span class="badge \${user.email_verified ? 'verified' : ''}">\${user.email_verified ? 'Yes' : 'No'}</span></td>
                                    <td>\${new Date(user.created_at).toLocaleString()}</td>
                                </tr>
                            \`).join('')}
                        </table>
                    \` : '<p class="empty">No users found</p>';

                    // Render investments table
                    const investmentsHtml = investments.length ? \`
                        <table>
                            <tr><th>ID</th><th>User ID</th><th>Investment Type</th></tr>
                            \${investments.map(inv => \`
                                <tr>
                                    <td>\${inv.id}</td>
                                    <td>\${inv.user_id}</td>
                                    <td>\${inv.investment_type}</td>
                                </tr>
                            \`).join('')}
                        </table>
                    \` : '<p class="empty">No investments found</p>';

                    // Render objectives table
                    const objectivesHtml = objectives.length ? \`
                        <table>
                            <tr><th>ID</th><th>User ID</th><th>Objective</th></tr>
                            \${objectives.map(obj => \`
                                <tr>
                                    <td>\${obj.id}</td>
                                    <td>\${obj.user_id}</td>
                                    <td>\${obj.objective}</td>
                                </tr>
                            \`).join('')}
                        </table>
                    \` : '<p class="empty">No objectives found</p>';

                    document.getElementById('users-table').innerHTML = usersHtml;
                    document.getElementById('investments-table').innerHTML = investmentsHtml;
                    document.getElementById('objectives-table').innerHTML = objectivesHtml;
                } catch (error) {
                    console.error('Error loading data:', error);
                    document.body.innerHTML += '<div style="color: red; margin: 20px;">Error loading data. Make sure the backend is running.</div>';
                }
            }

            loadData();
        </script>
    </body>
    </html>
  `;
  
  res.send(html);
});

// API endpoints for the viewer
router.get('/users', (req, res) => {
  db.all("SELECT * FROM users ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/investments', (req, res) => {
  db.all("SELECT * FROM user_investments", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/objectives', (req, res) => {
  db.all("SELECT * FROM user_objectives", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

export default router;