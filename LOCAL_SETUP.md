# 🖥️ CONFIGURACIÓN LOCAL DEL BACKEND

## Opción 1: Conectar a Railway PostgreSQL (RECOMENDADO para pruebas)

### 1. Obtener credenciales de Railway

En Railway, ve a tu servicio **Postgres**:

1. Click en el servicio **Postgres**
2. Ve a la pestaña **Variables**
3. Copia el valor de **DATABASE_URL**

La URL tendrá este formato:
```
postgresql://postgres:PASSWORD@containers-us-west-XXX.railway.app:PORT/railway
```

### 2. Configurar `.env` en el backend

Edita `backend/.env`:

```env
# Django core
SECRET_KEY=django-insecure-local-dev-key-2025
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Conexión a Railway PostgreSQL
DATABASE_URL=postgresql://postgres:PASSWORD@containers-us-west-XXX.railway.app:PORT/railway

# CORS (permitir frontend local)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Reemplaza `DATABASE_URL` con la URL completa que copiaste de Railway.**

### 3. Instalar dependencias

```powershell
cd backend
pip install -r requirements.txt
```

### 4. Verificar conexión a la base de datos

```powershell
python manage.py showmigrations
```

Si ves una lista de migraciones, ¡la conexión funciona! ✅

### 5. Aplicar migraciones (si es necesario)

```powershell
python manage.py migrate
```

### 6. Crear datos iniciales (si la BD está vacía)

```powershell
python manage.py create_initial_data
```

Esto creará:
- Usuario admin: `admin@enapu.com` / `admin123`
- Usuario operario: `operario@enapu.com` / `operario123`
- Usuario cliente: `cliente@empresa.com` / `cliente123`
- Zonas, terminales, muelles, etc.

### 7. Iniciar servidor de desarrollo

```powershell
python manage.py runserver
```

El backend estará disponible en: **http://localhost:8000**

### 8. Verificar que funciona

Abre en el navegador:
- **API Root:** http://localhost:8000/api/
- **Admin Panel:** http://localhost:8000/admin

---

## Opción 2: Base de datos SQLite local (desarrollo aislado)

Si prefieres NO usar Railway y trabajar 100% local:

### 1. Editar `backend/.env`

```env
# Django core
SECRET_KEY=django-insecure-local-dev-key-2025
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# NO incluir DATABASE_URL (usará SQLite por defecto)
# DATABASE_URL=

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 2. El archivo `settings.py` usará SQLite automáticamente

Si no existe `DATABASE_URL`, Django usará `db.sqlite3`.

### 3. Crear base de datos SQLite

```powershell
cd backend
python manage.py migrate
python manage.py create_initial_data
```

### 4. Iniciar servidor

```powershell
python manage.py runserver
```

---

## 🧪 Probar el Backend

### API Endpoints

```powershell
# Listar usuarios
curl http://localhost:8000/api/usuarios/

# Login
curl -X POST http://localhost:8000/api/login/ -H "Content-Type: application/json" -d "{\"username\":\"admin@enapu.com\",\"password\":\"admin123\"}"

# Listar tickets
curl http://localhost:8000/api/tickets/
```

### Admin Panel

1. Ve a: http://localhost:8000/admin
2. Login: `admin@enapu.com` / `admin123`
3. Explora los modelos

---

## 📋 Checklist

- [ ] `requirements.txt` instalado
- [ ] `.env` configurado con `DATABASE_URL` (Railway) o vacío (SQLite)
- [ ] `python manage.py migrate` ejecutado
- [ ] `python manage.py create_initial_data` ejecutado
- [ ] `python manage.py runserver` corriendo
- [ ] API responde en http://localhost:8000/api/
- [ ] Admin panel accesible en http://localhost:8000/admin

---

## 🐛 Troubleshooting

### Error: "No module named 'psycopg2'"

```powershell
pip install psycopg2-binary
```

### Error: "could not connect to server"

- Verifica que `DATABASE_URL` en `.env` sea correcta
- Verifica que Railway PostgreSQL esté activo
- Revisa que el puerto y password sean correctos

### Error: "CSRF verification failed"

En `backend/backend/settings.py`, agrega:

```python
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
]
```

### Error: "relation does not exist"

Ejecuta las migraciones:

```powershell
python manage.py migrate
```

### Base de datos vacía después de migrate

Ejecuta:

```powershell
python manage.py create_initial_data
```

---

## 🔄 Workflow de Desarrollo

```powershell
# Terminal 1: Backend
cd backend
python manage.py runserver

# Terminal 2: Frontend (otra terminal)
cd ..
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:8000
```

---

## 📚 Siguientes Pasos

Una vez que el backend local funcione:

1. **Probar frontend local:** `npm run dev`
2. **Configurar `VITE_API_URL`** en `.env` del frontend:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```
3. **Probar login** desde el frontend
4. **Verificar que todas las páginas funcionen**

---

**¡Backend local listo!** 🚀

Si necesitas conectar con Railway PostgreSQL, usa **Opción 1**.  
Si prefieres desarrollo 100% local, usa **Opción 2** (SQLite).
