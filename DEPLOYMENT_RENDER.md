# 🎨 DEPLOYMENT EN RENDER

## 📋 PRE-REQUISITOS

- Cuenta en [Render](https://render.com) (gratis)
- Repositorio en GitHub (RafaelCly/ENAPUU)
- Proyecto Django listo para producción

---

## 🚀 PASO A PASO

### 1. **Crear cuenta en Render**

1. Ve a https://render.com
2. Click en **"Get Started for Free"**
3. Conéctate con GitHub

---

### 2. **Crear PostgreSQL Database**

1. En el Dashboard de Render, click **"New +"** → **"PostgreSQL"**
2. Configuración:
   - **Name:** `enapuu-postgres`
   - **Database:** `enapuu_db`
   - **User:** `enapuu_user`
   - **Region:** Oregon (US West) - más cercano
   - **Plan:** **Free** (Gratis)

3. Click **"Create Database"**

4. **IMPORTANTE:** Guarda estos datos (aparecerán después de crear):
   - **Internal Database URL** (para conectar servicios dentro de Render)
   - **External Database URL** (para conectar desde tu local)

---

### 3. **Desplegar Backend Django**

1. Click **"New +"** → **"Web Service"**
2. Conecta tu repositorio: **RafaelCly/ENAPUU**
3. Configuración:

   | Campo | Valor |
   |-------|-------|
   | **Name** | `enapuu-backend` |
   | **Region** | Oregon (US West) |
   | **Branch** | `main` |
   | **Root Directory** | (dejar vacío) |
   | **Runtime** | `Python 3` |
   | **Build Command** | `./build.sh` |
   | **Start Command** | `cd backend && gunicorn backend.wsgi:application` |
   | **Plan** | **Free** |

4. Click **"Advanced"** y agrega **Environment Variables**:

   ```env
   PYTHON_VERSION=3.11.5
   SECRET_KEY=genera-una-clave-segura-aqui-usa-django-secret-key-generator
   DEBUG=False
   ALLOWED_HOSTS=.onrender.com
   DATABASE_URL=copia-internal-database-url-del-paso-2
   CORS_ALLOWED_ORIGINS=http://localhost:5173,https://tu-frontend.vercel.app
   ```

   **Para generar SECRET_KEY:**
   ```bash
   python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
   ```

5. Click **"Create Web Service"**

---

### 4. **Verificar Deployment**

Render comenzará a construir y desplegar:

1. **Build Logs:** Verás la instalación de dependencias
2. **Deploy Logs:** Verás las migraciones ejecutándose
3. Cuando veas **"Your service is live 🎉"**, copia la URL

Tu backend estará en:
```
https://enapuu-backend.onrender.com
```

---

### 5. **Probar el Backend**

```bash
# Verificar API
curl https://enapuu-backend.onrender.com/api/

# Verificar Admin
# Abre en navegador: https://enapuu-backend.onrender.com/admin
```

---

### 6. **Conectar desde Local (Opcional)**

Si quieres usar la base de datos de Render desde tu local:

1. Copia el **External Database URL** de tu PostgreSQL en Render
2. Edita `backend/.env`:

   ```env
   DATABASE_URL=postgresql://enapuu_user:password@dpg-xxx.oregon-postgres.render.com/enapuu_db
   ```

3. Ejecuta:
   ```bash
   cd backend
   python manage.py migrate
   python manage.py runserver
   ```

---

## 🔧 CONFIGURACIÓN AVANZADA

### Auto-Deploy desde GitHub

Render despliega automáticamente cuando haces push a `main`:

```bash
git add .
git commit -m "feat: Nuevas funcionalidades"
git push origin main
```

Render detectará el cambio y redesplegará automáticamente.

---

### Variables de Entorno Importantes

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `SECRET_KEY` | string largo aleatorio | Clave secreta de Django |
| `DEBUG` | `False` | Modo producción |
| `ALLOWED_HOSTS` | `.onrender.com` | Dominios permitidos |
| `DATABASE_URL` | URL de Postgres | Conexión a base de datos |
| `CORS_ALLOWED_ORIGINS` | URLs separadas por comas | CORS para frontend |

---

### Comandos Personalizados

Para ejecutar comandos en Render:

1. Ve a tu servicio → **"Shell"**
2. Ejecuta comandos:

   ```bash
   cd backend
   python manage.py createsuperuser
   python manage.py create_initial_data
   ```

---

## 🐛 TROUBLESHOOTING

### Error: "Build failed"

**Solución:** Verifica que `build.sh` tenga permisos de ejecución:

```bash
chmod +x build.sh
git add build.sh
git commit -m "fix: Add execute permission to build.sh"
git push origin main
```

### Error: "ModuleNotFoundError"

**Solución:** Verifica que `requirements.txt` esté en la raíz del proyecto.

### Error: "collectstatic failed"

**Solución:** Verifica que `STATIC_ROOT` esté configurado en `settings.py`:

```python
STATIC_ROOT = BASE_DIR / 'staticfiles'
```

### Error: "Database connection failed"

**Solución:** 
1. Verifica que `DATABASE_URL` esté configurada correctamente
2. Usa el **Internal Database URL** (no External) en las variables de entorno
3. Asegúrate de que el servicio Django esté en la misma región que PostgreSQL

### Error: "502 Bad Gateway"

**Solución:** 
1. Revisa los logs en Render
2. Verifica que el comando de inicio sea correcto:
   ```
   cd backend && gunicorn backend.wsgi:application
   ```

---

## 💰 COSTOS

### Plan Free (Gratis)

| Servicio | Límites |
|----------|---------|
| **Web Service** | 750 horas/mes, duerme después de 15 min inactividad |
| **PostgreSQL** | 90 días gratis, luego $7/mes, 256MB storage |
| **Build time** | Ilimitado |

**IMPORTANTE:** Los servicios gratuitos "duermen" después de 15 minutos de inactividad. La primera petición después puede tardar 30-60 segundos.

### Evitar que se duerma (opcional)

Usa un servicio como [UptimeRobot](https://uptimerobot.com) para hacer ping cada 5 minutos:
```
https://enapuu-backend.onrender.com/api/
```

---

## 📊 MONITOREO

### Logs en Tiempo Real

En Render Dashboard:
1. Click en tu servicio **enapuu-backend**
2. Tab **"Logs"**
3. Verás logs en tiempo real

### Métricas

Render muestra:
- CPU usage
- Memory usage
- Request count
- Response times

---

## 🔄 ACTUALIZAR DEPLOYMENT

### Desde GitHub (automático)

```bash
git add .
git commit -m "update: Descripción de cambios"
git push origin main
```

Render detecta el push y redespliega automáticamente.

### Manual Redeploy

1. Ve a tu servicio en Render
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🌐 SIGUIENTE PASO: FRONTEND EN VERCEL

Una vez que tu backend esté funcionando en Render:

1. Copia la URL: `https://enapuu-backend.onrender.com`
2. Ve a [DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md)
3. Configura `VITE_API_URL` con la URL de Render

---

## 📚 RECURSOS

- [Render Docs](https://render.com/docs)
- [Render Django Guide](https://render.com/docs/deploy-django)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [Render Free Tier](https://render.com/docs/free)

---

## ✅ CHECKLIST

- [ ] Cuenta en Render creada
- [ ] PostgreSQL database creada
- [ ] `build.sh` creado y con permisos
- [ ] Variables de entorno configuradas
- [ ] Web Service desplegado
- [ ] URL del backend obtenida: `https://_____.onrender.com`
- [ ] API responde correctamente
- [ ] Admin panel accesible
- [ ] Datos iniciales creados

---

**¡Backend en Render listo!** 🎨

Tiempo estimado: **15-20 minutos**

Costo: **GRATIS** (con limitaciones del free tier)
