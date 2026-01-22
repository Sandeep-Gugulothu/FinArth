const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('📊 FinArth Database Viewer');
console.log('==========================\n');

// View all users
db.all("SELECT * FROM users", (err, users) => {
  if (err) {
    console.error('Error fetching users:', err);
    return;
  }
  
  console.log('👥 USERS TABLE:');
  console.log('================');
  if (users.length === 0) {
    console.log('No users found.\n');
  } else {
    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.name || 'Not set'}`);
      console.log(`Country: ${user.country || 'Not set'}`);
      console.log(`Age: ${user.age || 'Not set'}`);
      console.log(`Risk Preference: ${user.risk_preference || 'Not set'}`);
      console.log(`Return Estimate: ${user.return_estimate || 'Not set'}`);
      console.log(`Email Verified: ${user.email_verified ? 'Yes' : 'No'}`);
      console.log(`Created: ${user.created_at}`);
      console.log('---');
    });
  }
  
  // View investments
  db.all("SELECT * FROM user_investments", (err, investments) => {
    if (err) {
      console.error('Error fetching investments:', err);
      return;
    }
    
    console.log('\n💰 USER INVESTMENTS:');
    console.log('====================');
    if (investments.length === 0) {
      console.log('No investments found.\n');
    } else {
      investments.forEach(inv => {
        console.log(`User ID: ${inv.user_id} | Investment: ${inv.investment_type}`);
      });
    }
    
    // View objectives
    db.all("SELECT * FROM user_objectives", (err, objectives) => {
      if (err) {
        console.error('Error fetching objectives:', err);
        return;
      }
      
      console.log('\n🎯 USER OBJECTIVES:');
      console.log('===================');
      if (objectives.length === 0) {
        console.log('No objectives found.\n');
      } else {
        objectives.forEach(obj => {
          console.log(`User ID: ${obj.user_id} | Objective: ${obj.objective}`);
        });
      }
      
      console.log('\n✅ Database view complete!');
      db.close();
    });
  });
});