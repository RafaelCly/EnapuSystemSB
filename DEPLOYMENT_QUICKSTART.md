# 🚀 GUÍA RÁPIDA DE DEPLOYMENT

## ⚡ Opción Recomendada: Railway + Vercel

### 🎯 Stack de Deployment:
- **Backend (Django + PostgreSQL):** Railway
- **Frontend (React):** Vercel

---

## 📝 CHECKLIST PRE-DEPLOYMENT

- [ ] Archivos de configuración creados:
  - `railway.json`
  - `Procfile`
  - `runtime.txt`
  - `vercel.json`
  - `.env.production`
- [ ] `requirements.txt` actualizado con:
  - `dj-database-url>=2.0.0`
  - `whitenoise>=6.4`
- [ ] `backend/backend/settings.py` actualizado para producción
- [ ] Commit y push de todos los cambios a GitHub

---

## 🚂 RAILWAY (Backend) - 15 minutos

### 1️⃣ Crear Cuenta
- Ve a [railway.app](https://railway.app/)
- Login con GitHub

### 2️⃣ Crear PostgreSQL
- New → Database → PostgreSQL
- Copia el `DATABASE_URL`

### 3️⃣ Desplegar Backend
- New → GitHub Repo → Selecciona "ENAPUU"
- Agrega variables de entorno:
  ```env
  SECRET_KEY=clave-super-secreta-larga-cambiala
  DEBUG=False
  ALLOWED_HOSTS=.up.railway.app,localhost
  DATABASE_URL=(autocompletado)
  CORS_ALLOWED_ORIGINS=https://tu-frontend.vercel.app,http://localhost:5173
  PYTHONUNBUFFERED=1
  ```

### 4️⃣ Poblar Base de Datos
```bash
railway login
railway link
railway run python backend/manage.py create_initial_data
```

### 5️⃣ Obtener URL
- Railway te dará: `https://tu-app.up.railway.app`
- Copia esta URL para Vercel

---

## ☁️ VERCEL (Frontend) - 10 minutos

### 1️⃣ Crear Cuenta
- Ve a [vercel.com](https://vercel.com/)
- Login con GitHub

### 2️⃣ Importar Proyecto
- Add New → Project
- Selecciona "ENAPUU"
- Framework: **Vite**
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `dist`

### 3️⃣ Configurar Variable de Entorno
```env
VITE_API_URL=https://tu-app.up.railway.app/api
```

### 4️⃣ Deploy
- Click "Deploy"
- Espera 2-3 minutos
- Obtendrás: `https://enapuu.vercel.app`

### 5️⃣ Actualizar CORS en Railway
Vuelve a Railway y actualiza:
```env
CORS_ALLOWED_ORIGINS=https://enapuu.vercel.app,http://localhost:5173
```

---

## ✅ VERIFICACIÓN

### Probar Backend
```bash
curl https://tu-app.up.railway.app/api/usuarios/
```

### Probar Frontend
1. Abre `https://enapuu.vercel.app`
2. Login con `admin@enapu.com` / `admin123`
3. Verifica que carguen tickets y usuarios

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Backend no responde
```bash
railway logs
```

### CORS bloqueado
Verifica que `CORS_ALLOWED_ORIGINS` en Railway incluya tu dominio de Vercel

### Variables no actualizan
En Railway → Settings → Redeploy

### Frontend muestra errores de API
Verifica que `VITE_API_URL` en Vercel apunte a Railway

---

## 💰 COSTOS

### Railway (Backend + DB)
- **Gratis:** $5/mes de crédito
- PostgreSQL 500MB incluido
- Suficiente para desarrollo

### Vercel (Frontend)
- **Gratis:** 100% gratis para proyectos personales
- Deploy ilimitados
- CDN global

**Total: GRATIS** 🎉

---

## 📚 GUÍAS COMPLETAS

- **[DEPLOYMENT_RAILWAY.md](./DEPLOYMENT_RAILWAY.md)** - Guía detallada de Railway
- **[DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md)** - Guía detallada de Vercel

---

## 🎉 LISTO!

Tu aplicación estará en línea:
- **API:** `https://tu-app.up.railway.app/api/`
- **Frontend:** `https://enapuu.vercel.app`

---

**Tiempo total:** ~25 minutos
**Costo:** GRATIS
