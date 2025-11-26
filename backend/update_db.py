import psycopg2
import os
from pathlib import Path

# Database connection parameters
DB_NAME = "ENAPU"
DB_USER = "postgres"
DB_PASSWORD = "Wisdom_2025"
DB_HOST = "localhost"
DB_PORT = "5432"

try:
    # Connect to PostgreSQL
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cur = conn.cursor()
    
    print("Conectado a PostgreSQL exitosamente")
    
    # Leer el script SQL
    sql_file = Path(__file__).parent / "update_usuario_table.sql"
    with open(sql_file, 'r', encoding='utf-8') as f:
        sql_script = f.read()
    
    # Ejecutar el script
    cur.execute(sql_script)
    conn.commit()
    
    print("✓ Script SQL ejecutado exitosamente")
    print("✓ Tabla Usuario actualizada con las nuevas columnas")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")
    if 'conn' in locals():
        conn.rollback()
