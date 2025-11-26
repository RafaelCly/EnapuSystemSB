# 🚀 GUÍA DE DEPLOYMENT - VERCEL (Frontend React)

## 🎯 ¿Por qué Vercel?

- ✅ Especializado en React/Next.js/Vite
- ✅ Deploy automático desde GitHub
- ✅ CDN global (rápido en todo el mundo)
- ✅ HTTPS automático
- ✅ **Completamente GRATIS para proyectos personales**
- ✅ Preview deployments automáticos

---

## 📋 PASO 1: PREPARAR EL PROYECTO

### 1.1 Crear archivo `vercel.json` en la raíz

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 1.2 Actualizar `vite.config.ts`

Asegúrate de que tenga esta configuración:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
```

### 1.3 Crear archivo `.env.production` en la raíz

```env
# URL del backend desplegado en Railway
VITE_API_URL=https://tu-app.up.railway.app/api
```

### 1.4 Actualizar `src/lib/api.ts`

Asegúrate de que use la variable de entorno correctamente:

```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  } as Record<string, string>;

  const resp = await fetch(url, { 
    ...opts, 
    headers, 
    credentials: 'include',
    mode: 'cors'
  });
  
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`${resp.status} ${resp.statusText}: ${text}`);
  }
  
  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) return resp.json();
  return resp.text();
}
```

### 1.5 Hacer commit de los cambios

```bash
git add .
git commit -m "feat: Configurar proyecto para Vercel deployment"
git push origin main
```

---

## 📦 PASO 2: CREAR CUENTA EN VERCEL

1. Ve a [vercel.com](https://vercel.com/)
2. Haz clic en **"Sign Up"**
3. Inicia sesión con GitHub
4. Autoriza Vercel para acceder a tus repositorios

---

## 🚀 PASO 3: IMPORTAR PROYECTO DESDE GITHUB

### 3.1 Crear nuevo proyecto

1. En Vercel dashboard, haz clic en **"Add New"** → **"Project"**
2. Busca y selecciona **"RafaelCly/ENAPUU"**
3. Haz clic en **"Import"**

### 3.2 Configurar el proyecto

Vercel detectará automáticamente que es un proyecto Vite. Configura:

**Framework Preset:** `Vite`

**Root Directory:** `./` (raíz del proyecto)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
dist
```

**Install Command:**
```bash
npm install
```

### 3.3 Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega:

```env
VITE_API_URL=https://tu-app.up.railway.app/api
```

⚠️ **IMPORTANTE:** Reemplaza `tu-app.up.railway.app` con tu dominio real de Railway.

### 3.4 Desplegar

1. Haz clic en **"Deploy"**
2. Vercel comenzará a construir tu aplicación
3. Espera 2-3 minutos (primera vez)
4. Verás: ✅ **"Your project has been deployed"**

---

## 🌐 PASO 4: CONFIGURAR CORS EN RAILWAY

Ahora que tienes el dominio de Vercel, actualiza tu backend:

1. Ve a Railway → Tu servicio Django
2. Ve a **"Variables"**
3. Actualiza `CORS_ALLOWED_ORIGINS`:

```env
CORS_ALLOWED_ORIGINS=https://tu-frontend.vercel.app,http://localhost:5173
```

4. Railway redesplegará automáticamente

---

## ✅ PASO 5: VERIFICAR EL DEPLOYMENT

### 5.1 Tu sitio estará en:

```
https://enapuu.vercel.app
```

(o similar, Vercel te asignará un dominio automáticamente)

### 5.2 Probar funcionalidad

1. Abre tu sitio en el navegador
2. Intenta hacer login con:
   - Email: `admin@enapu.com`
   - Password: `admin123`
3. Verifica que puedas ver tickets, usuarios, etc.

### 5.3 Ver logs de build

1. En Vercel dashboard → Tu proyecto
2. Click en el deployment actual
3. Ve a la pestaña **"Building"** para ver logs

---

## 🔄 CONTINUOUS DEPLOYMENT

Vercel despliega automáticamente cuando haces push:

```bash
# Hacer cambios en el frontend
git add src/
git commit -m "feat: Mejorar UI del dashboard"
git push origin main

# Vercel detecta el push y despliega automáticamente
# Recibirás un email cuando termine
```

### Preview Deployments

Cuando crees una Pull Request en GitHub:
- Vercel creará un **preview deployment** automático
- Tendrás una URL única para probar los cambios
- Ejemplo: `https://enapuu-git-feature-nueva-pr.vercel.app`

---

## 🎨 PASO 6: PERSONALIZAR DOMINIO (Opcional)

### 6.1 Usar dominio personalizado

1. En Vercel → Tu proyecto → **"Settings"** → **"Domains"**
2. Haz clic en **"Add"**
3. Ingresa tu dominio: `www.miapp.com`
4. Vercel te dará instrucciones DNS

### 6.2 Configurar DNS

En tu proveedor de dominios (GoDaddy, Namecheap, etc.):

**Tipo A Record:**
```
@  →  76.76.21.21
```

**Tipo CNAME Record:**
```
www  →  cname.vercel-dns.com
```

---

## 📊 ANALÍTICAS Y MONITOREO

### Analíticas incluidas (gratis):

1. Ve a tu proyecto → **"Analytics"**
2. Verás:
   - Page views
   - Unique visitors
   - Top pages
   - Geografía de usuarios
   - Device types

### Performance Monitoring:

1. Ve a **"Speed Insights"**
2. Verás métricas Core Web Vitals:
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

---

## 🔧 CONFIGURACIÓN AVANZADA

### Redirects y Rewrites

Edita `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Variables de entorno por rama

```bash
# Producción (main branch)
VITE_API_URL=https://api-prod.railway.app/api

# Staging (develop branch)
VITE_API_URL=https://api-staging.railway.app/api

# Development (local)
VITE_API_URL=http://localhost:8000/api
```

---

## 🐛 TROUBLESHOOTING

### Error: "404 on page refresh"

**Solución:** Asegúrate de tener el `rewrites` en `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Error: "CORS policy blocked"

**Solución:** Verifica que Railway tenga tu dominio de Vercel en `CORS_ALLOWED_ORIGINS`:
```env
CORS_ALLOWED_ORIGINS=https://tu-app.vercel.app,http://localhost:5173
```

### Error: "Environment variable not defined"

**Solución:** 
1. Ve a Vercel → Settings → Environment Variables
2. Agrega: `VITE_API_URL` con el valor de tu API
3. Redeploy: Deployments → ... → Redeploy

### Error: "Build fails with 'vite not found'"

**Solución:** Verifica `package.json`:
```json
{
  "scripts": {
    "build": "tsc && vite build"
  }
}
```

### Sitio carga lento

**Solución:** Optimiza el build en `vite.config.ts`:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'ui-vendor': ['lucide-react'],
      },
    },
  },
},
```

---

## 💰 COSTOS

### Plan Hobby (GRATIS)
- ✅ Deploy ilimitados
- ✅ Bandwidth: 100GB/mes
- ✅ SSL/HTTPS automático
- ✅ Custom domains
- ✅ Preview deployments
- ✅ Analíticas básicas

### Plan Pro ($20/mes)
- Todo lo del Hobby +
- Password protection
- Analíticas avanzadas
- Prioridad en soporte

**Para este proyecto, el plan GRATIS es más que suficiente.**

---

## 🚀 COMANDOS ÚTILES CON VERCEL CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy desde local
vercel

# Deploy a producción
vercel --prod

# Ver logs en tiempo real
vercel logs

# Ver deployments
vercel ls

# Abrir proyecto en browser
vercel open
```

---

## 📝 CHECKLIST DE DEPLOYMENT

- [ ] Archivo `vercel.json` creado
- [ ] Variable `VITE_API_URL` configurada en Vercel
- [ ] Backend desplegado en Railway
- [ ] CORS configurado en Railway con dominio de Vercel
- [ ] Build exitoso en Vercel
- [ ] Login funciona correctamente
- [ ] Rutas de React funcionan (no 404)
- [ ] API calls funcionan desde el frontend

---

## 🎉 RESULTADO FINAL

Tu aplicación estará disponible en:

- **Frontend (Vercel):** `https://enapuu.vercel.app`
- **Backend (Railway):** `https://tu-app.up.railway.app/api`

### Flujo completo:

```
Usuario → Vercel (Frontend)
            ↓
         (HTTPS)
            ↓
Railway (Backend API + PostgreSQL)
```

---

## 📚 RECURSOS ADICIONALES

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [React Router on Vercel](https://vercel.com/guides/deploying-react-with-vercel)

---

**Última actualización:** 12 de noviembre de 2025
