
import sqlite3
import os

db_path = os.path.join(os.getcwd(), 'database.sqlite')
print(f"Checking database at: {db_path}")

conn = sqlite3.connect(db_path)
c = conn.cursor()
c.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = c.fetchall()
print("Tables in database:")
for t in tables:
    print(f"- {t[0]}")

for t in tables:
    table_name = t[0]
    print(f"\nSchema for {table_name}:")
    c.execute(f"PRAGMA table_info({table_name})")
    info = c.fetchall()
    for col in info:
        print(f"  {col[1]} ({col[2]})")

conn.close()
