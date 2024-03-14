import psycopg2
  
conn = psycopg2.connect(host='melo-db.cl42gyco25t3.us-east-2.rds.amazonaws.com',
                          database='melo-db',
                          user='postgres',
                          password='wi2ceITIK4Boa08XgQyU')

print(conn.closed)
cursor = conn.cursor()
cursor.execute("select relname from pg_class where relkind='r' and relname !~ '^(pg_|sql_)';")
print(cursor.fetchall())
