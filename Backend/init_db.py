import sqlite3
import os

# Ensure backend directory exists
os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)

db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.sqlite3')
print(f"Connecting to {db_path}...")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create inventory table
cursor.execute('''
CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource TEXT NOT NULL,
    warehouse TEXT NOT NULL,
    available INTEGER DEFAULT 0,
    in_transit INTEGER DEFAULT 0,
    unit TEXT NOT NULL,
    critical BOOLEAN DEFAULT 0
)
''')

# Clear existing data just in case we run this multiple times
cursor.execute('DELETE FROM inventory')

dummy_data = [
    ('Food Packets', 'WH-Shivajinagar', 4200, 1200, 'units', False),
    ('Drinking Water', 'WH-Shivajinagar', 8500, 500, 'litres', False),
    ('Medical Kits', 'WH-Pimpri-01', 18, 25, 'kits', True),
    ('Food Packets', 'WH-Pimpri-01', 120, 0, 'units', True),
    ('Fuel (Diesel)', 'WH-Hadapsar-02', 12000, 2000, 'litres', False),
    ('Tarpaulin Sheets', 'WH-Hadapsar-02', 650, 100, 'units', False),
    ('Drinking Water', 'WH-Katraj-03', 2100, 0, 'litres', True),
    ('Medical Kits', 'WH-Katraj-03', 540, 10, 'kits', False),
    ('Rescue Boats', 'WH-Shivajinagar', 18, 3, 'units', False),
    ('Blankets/Warm Gear', 'WH-Pimpri-01', 890, 200, 'sets', False)
]

cursor.executemany('''
INSERT INTO inventory (resource, warehouse, available, in_transit, unit, critical)
VALUES (?, ?, ?, ?, ?, ?)
''', dummy_data)

conn.commit()
print("Successfully initialized SQLite database with dummy inventory data.")

# Verify insertion
cursor.execute('SELECT COUNT(*) FROM inventory')
count = cursor.fetchone()[0]
print(f"Total records in 'inventory': {count}")

conn.close()
