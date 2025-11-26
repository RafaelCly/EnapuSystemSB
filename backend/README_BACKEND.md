# Backend quick start (Django)

This backend contains a `core` app with models matching the SQL scripts in `backend/backend/*.sql`.

Quick steps (development):

1. Activate virtual environment
```powershell
.venv\Scripts\Activate.ps1
```

2. Install dependencies
```powershell
cd .\backend
python -m pip install --upgrade pip
pip install -r ..\requirements.txt
```

3. Create migrations and migrate
```powershell
cd .\backend
python manage.py makemigrations core
python manage.py migrate
```

4. (Optional) Load the provided SQLs into your Postgres DB (if you prefer raw SQL). Files are in `backend/backend/`.
	Example using psql (replace values):
	```powershell
	psql "postgres://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME" -f backend\crea-tablas-ENAPU.sql
	psql "postgres://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME" -f backend\objetos-bd\ -\ ENAPU.sql
	psql "postgres://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME" -f backend\poblamiento-datos-ENAPU.sql
	```

5. Run server
```powershell
python manage.py runserver
```

API is available at `http://127.0.0.1:8000/api/` with endpoints like `/api/roles/`, `/api/usuarios/`, etc.

CORS: frontend origin `http://localhost:5173` is allowed by default; change `CORS_ALLOWED_ORIGINS` in `.env` if needed.
