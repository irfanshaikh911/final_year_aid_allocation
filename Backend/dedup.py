import sqlite3
conn = sqlite3.connect('C:/Users/Admin/Documents/Personal/Final/backend/database.sqlite3')
cursor = conn.cursor()
cursor.execute('SELECT MIN(id), resource, warehouse, SUM(available), SUM(in_transit) FROM inventory GROUP BY resource, warehouse HAVING COUNT(*) > 1')
dups = cursor.fetchall()
for d in dups:
    cursor.execute('UPDATE inventory SET available = ?, in_transit = ? WHERE id = ?', (d[3], d[4], d[0]))
    cursor.execute('DELETE FROM inventory WHERE resource = ? AND warehouse = ? AND id != ?', (d[1], d[2], d[0]))
conn.commit()
conn.close()
print('Deduplicated rows!')
