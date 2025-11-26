# 📋 GUÍA DE CONFIGURACIÓN - SISTEMA ENAPU

## 🎯 Para nuevos desarrolladores que clonan el proyecto

### 1️⃣ REQUISITOS PREVIOS

Antes de empezar, asegúrate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **Python** (v3.10 o superior) - [Descargar](https://www.python.org/)
- **PostgreSQL** (v14 o superior) - [Descargar](https://www.postgresql.org/download/)
- **Git** - [Descargar](https://git-scm.com/)

---

## 2️⃣ CLONAR EL REPOSITORIO

```bash
git clone https://github.com/RafaelCly/ENAPUU.git
cd ENAPUU
```

---

## 3️⃣ CONFIGURAR BASE DE DATOS POSTGRESQL

### Paso 1: Crear la base de datos

Abre **pgAdmin 4** o **psql** y ejecuta:

```sql
CREATE DATABASE enapu_db;
```

### Paso 2: Crear archivo `.env` en la carpeta `backend`

Crea un archivo llamado `.env` dentro de la carpeta `backend/` con este contenido:

```env
# Django Settings
SECRET_KEY=django-insecure-2#o3bgaqo^e#xj8@_p$2%!@1hok__)4k&lc_^+u1+8c6)ci#8g
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=ENAPU
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA_POSTGRESQL
DB_HOST=localhost
DB_PORT=5432

# CORS (Frontend URLs permitidas)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080,http://localhost:8081,http://127.0.0.1:8080,http://127.0.0.1:8081
```

> **⚠️ IMPORTANTE:** Reemplaza `TU_CONTRASEÑA_POSTGRESQL` con la contraseña que configuraste en PostgreSQL.

---

## 4️⃣ CONFIGURAR BACKEND (Django)

### Paso 1: Crear entorno virtual de Python

```bash
cd backend
python -m venv venv
```

### Paso 2: Activar entorno virtual

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### Paso 3: Instalar dependencias

```bash
pip install -r requirements.txt
```

### Paso 4: Crear tablas en la base de datos

```bash
python manage.py migrate
```

### Paso 5: Cargar datos iniciales

```bash
python manage.py create_initial_data
```

Este comando creará:
- ✅ 3 roles (ADMINISTRADOR, OPERARIO, CLIENTE)
- ✅ 3 niveles de acceso
- ✅ 3 usuarios de prueba (admin, operario, cliente)
- ✅ 3 zonas de almacenamiento
- ✅ Múltiples slots (ubicaciones)
- ✅ 3 buques
- ✅ Citas de recojo
- ✅ 20 contenedores
- ✅ 10 tickets de ejemplo

### Paso 6: Ejecutar servidor Django

```bash
python manage.py runserver
```

El backend estará disponible en: **http://127.0.0.1:8000**

---

## 5️⃣ CONFIGURAR FRONTEND (React + Vite)

### Paso 1: Instalar dependencias de Node.js

Abre una **nueva terminal** (sin cerrar la del backend) y ejecuta:

```bash
# Desde la raíz del proyecto
npm install
```

### Paso 2: Crear archivo `.env` en la raíz del proyecto

Crea un archivo `.env` en la **raíz del proyecto** (NO en backend):

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### Paso 3: Ejecutar servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

## 6️⃣ PROBAR EL SISTEMA

### Usuarios de Prueba

Ingresa con estas credenciales en **http://localhost:5173**:

#### 👨‍💼 Administrador
- **Email:** `admin@enapu.com`
- **Password:** `admin123`

#### 👷 Operario
- **Email:** `operario@enapu.com`
- **Password:** `operario123`

#### 🚢 Cliente
- **Email:** `cliente@empresa.com`
- **Password:** `cliente123`

---

## 7️⃣ ESTRUCTURA DEL PROYECTO

```
ENAPUU/
├── backend/                    # Django (API REST)
│   ├── backend/               # Configuración principal
│   │   ├── settings.py       # Configuración Django
│   │   ├── urls.py           # URLs principales
│   │   └── wsgi.py
│   ├── core/                  # App principal
│   │   ├── models.py         # Modelos de BD
│   │   ├── serializers.py    # Serializadores DRF
│   │   ├── views.py          # ViewSets de API
│   │   └── urls.py           # URLs de la API
│   ├── manage.py
│   └── requirements.txt      # Dependencias Python
│
├── src/                       # React + TypeScript
│   ├── components/           # Componentes reutilizables
│   ├── pages/                # Páginas de la aplicación
│   │   ├── admin/           # Vistas de administrador
│   │   ├── operator/        # Vistas de operario
│   │   └── client/          # Vistas de cliente
│   ├── lib/                  # Utilidades
│   │   ├── api.ts           # Funciones de API
│   │   └── utils.ts
│   └── main.tsx
│
├── package.json              # Dependencias Node.js
├── vite.config.ts            # Configuración Vite
└── tsconfig.json             # Configuración TypeScript
```

---

## 8️⃣ COMANDOS ÚTILES

### Backend (Django)

```bash
# Crear nuevas migraciones después de cambiar models.py
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario de Django Admin
python manage.py createsuperuser

# Acceder a Django Admin
# http://127.0.0.1:8000/admin/

# Ejecutar scripts personalizados
python nombre_script.py
```

### Frontend (React)

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## 9️⃣ SOLUCIÓN DE PROBLEMAS COMUNES

### ❌ Error: "ModuleNotFoundError: No module named 'django'"

**Solución:** Asegúrate de activar el entorno virtual:
```bash
cd backend
.\venv\Scripts\Activate.ps1  # Windows
```

### ❌ Error: "FATAL: password authentication failed for user"

**Solución:** Verifica tu contraseña en `backend/.env`:
```env
DB_PASSWORD=TU_CONTRASEÑA_CORRECTA
```

### ❌ Error: "Port 8000 is already in use"

**Solución:** Mata el proceso que usa el puerto:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### ❌ Error: "npm ERR! code ELIFECYCLE"

**Solución:** Elimina node_modules y reinstala:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🔟 API ENDPOINTS PRINCIPALES

### Base URL: `http://127.0.0.1:8000/api/`

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/usuarios/` | GET, POST | Listar/crear usuarios |
| `/usuarios/login/` | POST | Login de usuario |
| `/tickets/` | GET, POST | Listar/crear tickets |
| `/contenedores/` | GET, POST | Listar/crear contenedores |
| `/zonas/` | GET | Listar zonas |
| `/ubicaciones-slot/` | GET | Listar slots |
| `/buques/` | GET | Listar buques |
| `/citas-recojo/` | GET, POST | Listar/crear citas |

---

## 1️⃣1️⃣ FLUJO DE TRABAJO DEL SISTEMA

### 📦 Flujo de Contenedores:

1. **Cliente** → Reserva cita con contenedor y buque
2. **Operario** → Escanea código de barras del contenedor
3. **Sistema** → Valida reserva y asigna slot
4. **Sistema** → Crea ticket con estado "Validado"
5. **Operario** → Registra entrada física (estado "En Proceso")
6. **Monitor** → Muestra tickets en tiempo real
7. **Operario** → Registra salida (estado "Completado")

### 🎫 Estados de Tickets:

- **Pendiente:** Ticket creado pero no validado
- **Validado:** Contenedor escaneado y verificado
- **En Cola:** En espera de procesamiento
- **En Proceso:** Contenedor en puerto
- **Completado:** Contenedor retirado

---

## 1️⃣2️⃣ CONTACTO Y SOPORTE

Si tienes problemas, contacta al equipo:

- **Rafael Cly** - Desarrollador Principal
- **GitHub:** [RafaelCly/ENAPUU](https://github.com/RafaelCly/ENAPUU)

---

## ✅ CHECKLIST DE CONFIGURACIÓN

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `enapu_db` creada
- [ ] Archivo `backend/.env` configurado con tu contraseña
- [ ] Entorno virtual de Python activado
- [ ] `pip install -r requirements.txt` ejecutado
- [ ] `python manage.py migrate` ejecutado
- [ ] `python manage.py create_initial_data` ejecutado
- [ ] Backend corriendo en puerto 8000
- [ ] Archivo `.env` en raíz del proyecto creado
- [ ] `npm install` ejecutado
- [ ] Frontend corriendo en puerto 5173
- [ ] Login exitoso con `admin@enapu.com`

---

## 🎉 ¡LISTO PARA DESARROLLAR!

Una vez completados todos los pasos, el sistema estará 100% funcional y listo para trabajar.

**Recordatorio:** Siempre ejecuta **dos terminales**:
1. Una para el backend: `python manage.py runserver`
2. Otra para el frontend: `npm run dev`

---

**Última actualización:** 11 de noviembre de 2025
