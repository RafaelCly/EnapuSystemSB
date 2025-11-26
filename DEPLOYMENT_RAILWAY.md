# 🚀 GUÍA DE DEPLOYMENT - RAILWAY (Backend Django + PostgreSQL)

## 🎯 ¿Por qué Railway?

- ✅ PostgreSQL incluido (gratuito hasta 500MB)
- ✅ Deploy automático desde GitHub
- ✅ Variables de entorno fáciles de configurar
- ✅ SSL/HTTPS automático
- ✅ $5 de crédito gratis al mes

---

## 📋 PASO 1: PREPARAR EL PROYECTO

### 1.1 Crear archivo `railway.json` en la raíz

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && python manage.py migrate && python manage.py collectstatic --noinput && gunicorn backend.wsgi --bind 0.0.0.0:$PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 1.2 Crear archivo `Procfile` en la raíz

```
web: cd backend && gunicorn backend.wsgi --bind 0.0.0.0:$PORT
release: cd backend && python manage.py migrate && python manage.py collectstatic --noinput
```

### 1.3 Crear archivo `runtime.txt` en la raíz

```
python-3.11.5
```

### 1.4 Actualizar `backend/backend/settings.py`

Agrega estas configuraciones para producción:

```python
import os
import dj_database_url

# ... código existente ...

# ALLOWED_HOSTS para Railway
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost', '127.0.0.1'])

# Agregar dominio de Railway cuando lo tengas
if 'RAILWAY_STATIC_URL' in os.environ:
    ALLOWED_HOSTS.append(os.environ.get('RAILWAY_STATIC_URL'))

# Database - Railway provee DATABASE_URL automáticamente
if 'DATABASE_URL' in os.environ:
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ['DATABASE_URL'],
            conn_max_age=600,
            conn_health_checks=True,
        )
    }

# Static files para producción
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = []

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# WhiteNoise para servir archivos estáticos
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Security settings para producción
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
```

### 1.5 Actualizar `requirements.txt`

Agrega estas dependencias:

```txt
dj-database-url>=2.0.0
whitenoise>=6.4.0
```

### 1.6 Hacer commit de los cambios

```bash
git add .
git commit -m "feat: Configurar proyecto para Railway deployment"
git push origin main
```

---

## 📦 PASO 2: CREAR CUENTA EN RAILWAY

1. Ve a [railway.app](https://railway.app/)
2. Haz clic en **"Start a New Project"**
3. Inicia sesión con GitHub
4. Autoriza Railway para acceder a tus repositorios

---

## 🗄️ PASO 3: CREAR BASE DE DATOS POSTGRESQL

1. En Railway, haz clic en **"+ New"**
2. Selecciona **"Database"**
3. Elige **"PostgreSQL"**
4. Espera a que se cree (toma ~30 segundos)
5. Haz clic en la base de datos
6. Ve a la pestaña **"Variables"**
7. Copia el valor de **`DATABASE_URL`** (lo usarás después)

---

## 🚂 PASO 4: DESPLEGAR EL BACKEND

### 4.1 Agregar servicio desde GitHub

1. En Railway, haz clic en **"+ New"**
2. Selecciona **"GitHub Repo"**
3. Busca y selecciona **"RafaelCly/ENAPUU"**
4. Railway detectará automáticamente que es Python/Django

### 4.2 Configurar variables de entorno

Haz clic en tu servicio → pestaña **"Variables"** → Agrega estas variables:

```env
# Django
SECRET_KEY=tu-clave-secreta-super-larga-y-segura-cambiar-esto
DEBUG=False
ALLOWED_HOSTS=.up.railway.app,localhost,127.0.0.1

# Database (Railway lo provee automáticamente, pero verifica)
DATABASE_URL=(ya debería estar configurada automáticamente)

# CORS - Agregar tu dominio de Vercel después
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://tu-frontend.vercel.app

# Python
PYTHONUNBUFFERED=1
```

### 4.3 Conectar con PostgreSQL

1. En tu servicio de Django, ve a **"Settings"**
2. Busca la sección **"Service Variables"**
3. Haz clic en **"+ New Variable"**
4. Selecciona **"Add Reference"**
5. Elige tu base de datos PostgreSQL
6. Selecciona **`DATABASE_URL`**

### 4.4 Configurar el dominio

1. Railway generará un dominio automáticamente como: `tu-app.up.railway.app`
2. Copia este dominio
3. Actualiza la variable `ALLOWED_HOSTS`:
   ```
   ALLOWED_HOSTS=tu-app.up.railway.app,localhost,127.0.0.1
   ```

### 4.5 Desplegar

Railway desplegará automáticamente. Monitorea los logs:

```
Building...
Installing dependencies...
Running migrations...
Collecting static files...
Starting Gunicorn...
✅ Deployed successfully
```

---

## 🧪 PASO 5: POBLAR LA BASE DE DATOS

### Opción 1: Usar Railway CLI (Recomendado)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Ejecutar comando en Railway
railway run python backend/manage.py create_initial_data
```

### Opción 2: Usar Railway Dashboard

1. Ve a tu servicio en Railway
2. Click en **"Settings"** → **"Deploy Trigger"**
3. Agrega este comando de inicio único:
   ```bash
   cd backend && python manage.py create_initial_data && gunicorn backend.wsgi
   ```
4. Después del primer deploy, quita el comando `create_initial_data`

---

## ✅ PASO 6: VERIFICAR EL DEPLOYMENT

### 6.1 Probar la API

```bash
# Reemplaza con tu dominio de Railway
curl https://tu-app.up.railway.app/api/usuarios/

# O visita en el navegador:
https://tu-app.up.railway.app/api/
```

### 6.2 Probar Django Admin

```
https://tu-app.up.railway.app/admin/
```

### 6.3 Ver logs en Railway

1. Haz clic en tu servicio
2. Ve a la pestaña **"Deployments"**
3. Haz clic en el deployment actual
4. Verás los logs en tiempo real

---

## 🔧 COMANDOS ÚTILES CON RAILWAY CLI

```bash
# Ver logs en tiempo real
railway logs

# Ejecutar migraciones
railway run python backend/manage.py migrate

# Crear superusuario
railway run python backend/manage.py createsuperuser

# Abrir shell de Django
railway run python backend/manage.py shell

# Ver variables de entorno
railway variables

# Conectar a PostgreSQL
railway connect postgres
```

---

## 🐛 TROUBLESHOOTING

### Error: "Application failed to respond"

```bash
# Verifica que Gunicorn esté instalado
railway run pip list | grep gunicorn

# Verifica los logs
railway logs
```

### Error: "Database connection failed"

1. Verifica que `DATABASE_URL` esté configurada
2. En Railway dashboard → PostgreSQL → Variables → Copia `DATABASE_URL`
3. Pégala manualmente en tu servicio Django

### Error: "Static files not found"

```bash
# Ejecutar collectstatic manualmente
railway run python backend/manage.py collectstatic --noinput
```

### Error: "Port already in use"

Railway usa la variable `$PORT` automáticamente. Asegúrate de que tu `Procfile` use:
```
gunicorn backend.wsgi --bind 0.0.0.0:$PORT
```

---

## 💰 COSTOS

### Plan Gratuito (Hobby)
- **$5 de crédito gratis/mes**
- PostgreSQL: 500MB (gratis)
- 500 horas de ejecución/mes
- Deploy ilimitados
- Perfecto para desarrollo y demos

### Plan Pro ($20/mes)
- $20 de crédito/mes
- Sin límites de recursos
- Priority support
- Custom domains

---

## 📊 MONITOREO

Railway provee métricas automáticas:
- CPU usage
- Memory usage
- Network traffic
- Request logs
- Error logs

Accede desde: Servicio → **"Metrics"**

---

## 🔄 CONTINUOUS DEPLOYMENT

Railway hace deploy automático cuando haces push a GitHub:

```bash
# Hacer cambios locales
git add .
git commit -m "feat: Nueva funcionalidad"
git push origin main

# Railway detecta el push y despliega automáticamente
```

---

## 📝 NOTAS IMPORTANTES

1. **Backup de Base de Datos:**
   ```bash
   railway run pg_dump $DATABASE_URL > backup.sql
   ```

2. **Variables Secretas:**
   - Nunca subas archivos `.env` al repositorio
   - Usa las variables de Railway para datos sensibles

3. **SSL/HTTPS:**
   - Railway provee HTTPS automáticamente
   - No necesitas configurar certificados

4. **Custom Domain (Opcional):**
   - Settings → Domains → Add Custom Domain
   - Configura CNAME en tu proveedor DNS

---

## 🎉 RESULTADO FINAL

Tu API estará disponible en:
- **Producción:** `https://tu-app.up.railway.app/api/`
- **Admin:** `https://tu-app.up.railway.app/admin/`
- **Health:** `https://tu-app.up.railway.app/api/usuarios/`

---

**Última actualización:** 12 de noviembre de 2025
