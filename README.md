# 🚢 Sistema de Gestión Portuaria ENAPU

Sistema moderno de gestión portuaria desarrollado con **React + TypeScript + Supabase**.

## 🌟 Características

- ✅ **Frontend moderno** con React 18 + TypeScript + Vite
- ✅ **UI elegante** con shadcn/ui y Tailwind CSS
- ✅ **Base de datos en la nube** con Supabase (PostgreSQL)
- ✅ **Gestión completa de tickets** de contenedores
- ✅ **Control de ubicaciones** y zonas del puerto
- ✅ **Facturación y pagos** integrados
- ✅ **Dashboard en tiempo real** con métricas operacionales
- ✅ **Responsive design** para desktop y mobile

---

## 📋 Requisitos Previos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **npm** o **yarn**
- **Cuenta de Supabase** ([Crear gratis](https://supabase.com))

---

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd "ENAPU - SUPABASE"
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y edita con tus credenciales:

```bash
copy .env.example .env
```

Edita `.env` y agrega tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_publica
VITE_APP_ENV=development
```

> 💡 Obtén tus credenciales en Supabase: **Settings → API**

### 4. Configurar la base de datos en Supabase

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Abre **SQL Editor**
3. Ejecuta el script completo: [`supabase_migration_complete.sql`](./supabase_migration_complete.sql)
4. Verifica que se crearon las 12 tablas

> 📖 Ver guía detallada: [GUIA_MIGRACION_SUPABASE.md](./GUIA_MIGRACION_SUPABASE.md)

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## 📁 Estructura del Proyecto

```
ENAPU - SUPABASE/
├── src/
│   ├── components/        # Componentes React reutilizables
│   ├── pages/             # Páginas de la aplicación
│   ├── lib/
│   │   ├── supabase.ts    # Cliente de Supabase
│   │   └── api.ts         # Funciones API con Supabase
│   ├── hooks/             # Custom React hooks
│   └── main.tsx           # Punto de entrada
├── public/                # Archivos estáticos
├── .env                   # Variables de entorno (no subir a git)
├── .env.example           # Plantilla de variables de entorno
├── supabase_migration_complete.sql  # Script de migración de BD
└── package.json
```

---

## 🗄️ Modelo de Base de Datos

El sistema gestiona las siguientes entidades principales:

### Entidades Principales

- **Usuario** - Gestión de usuarios (admins, operarios, clientes)
- **Ticket** - Registro de entrada/salida de contenedores
- **Contenedor** - Información de contenedores
- **Ubicacion_slot** - Slots de almacenamiento en el puerto
- **Zona** - Zonas del puerto (Seco, Reefer, Inspección)
- **Buque** - Buques que transportan contenedores
- **Factura** - Facturación de servicios
- **Pago** - Registro de pagos recibidos
- **Cita_recojo** - Programación de retiro de contenedores

> 📊 Ver diagrama completo: [MODELO_DATOS.md](./MODELO_DATOS.md)

---

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultra-rápido
- **shadcn/ui** - Componentes UI modernos
- **Tailwind CSS** - Estilos utility-first
- **React Router** - Navegación
- **TanStack Query** - State management y caching

### Backend

- **Supabase** - Backend-as-a-Service
  - PostgreSQL 15 (Base de datos)
  - API REST automática
  - Realtime subscriptions
  - Row Level Security (RLS)

---

## 📚 Scripts Disponibles

```bash
# Desarrollo
npm run dev           # Iniciar servidor de desarrollo

# Producción
npm run build         # Crear build optimizado
npm run preview       # Preview del build de producción

# Calidad de código
npm run lint          # Ejecutar ESLint
```

---

## 🔒 Seguridad

### Mejores Prácticas Implementadas

- ✅ Variables de entorno para credenciales
- ✅ `.env` en `.gitignore`
- ✅ API Key pública (anon) en frontend
- ⚠️ **TODO**: Implementar Row Level Security (RLS) en Supabase
- ⚠️ **TODO**: Hash de contraseñas con bcrypt (o usar Supabase Auth)

### Recomendaciones para Producción

1. **Habilitar RLS** en Supabase para proteger datos
2. **Configurar Supabase Auth** para autenticación segura
3. **Usar variables de entorno** en tu hosting (Vercel, Netlify, etc.)
4. **No hardcodear** credenciales en el código

---

## 📖 Documentación Adicional

- **[GUIA_MIGRACION_SUPABASE.md](./GUIA_MIGRACION_SUPABASE.md)** - Guía paso a paso de migración
- **[MODELO_DATOS.md](./MODELO_DATOS.md)** - Documentación completa del modelo de datos
- **[README_SUPABASE.md](./README_SUPABASE.md)** - Resumen rápido de Supabase
- **[consultas_utiles_supabase.sql](./consultas_utiles_supabase.sql)** - Consultas SQL útiles

---

## 🚀 Deploy a Producción

### Vercel (Recomendado)

1. Haz push de tu código a GitHub
2. Conecta tu repo en [Vercel](https://vercel.com)
3. Agrega las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automático ✅

### Netlify

Similar a Vercel, configura las variables de entorno en el dashboard.

---

## 🐛 Troubleshooting

### Error: "Cannot read properties of undefined"

**Problema**: El archivo `.env` no se está leyendo.

**Solución**:

1. Verifica que el archivo se llame exactamente `.env` (no `.env.txt`)
2. Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "Failed to fetch"

**Problema**: Las credenciales de Supabase son incorrectas.

**Solución**:

1. Verifica que las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` sean correctas
2. Verifica que el proyecto de Supabase esté activo

### No veo datos en las tablas

**Problema**: El script SQL no se ejecutó correctamente.

**Solución**:

1. Ve a Supabase → Table Editor
2. Si no ves las 12 tablas, ejecuta de nuevo `supabase_migration_complete.sql`

---

## 📞 Soporte

Si tienes problemas:

1. Revisa la [documentación de Supabase](https://supabase.com/docs)
2. Consulta la sección Troubleshooting arriba
3. Revisa los [issues del proyecto](https://github.com/tu-repo/issues)

---

## 📝 Licencia

Este proyecto es privado y confidencial.

---

## 👥 Desarrollado por

**Sistema ENAPU** - Gestión Portuaria Moderna

---

**¿Listo para empezar?** 🚀

```bash
npm install
npm run dev
```
