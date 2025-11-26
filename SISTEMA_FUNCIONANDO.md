# Sistema ENAPU - Gestión de Tickets Portuarios

## 🚀 Estado del Sistema

✅ **Backend Django**: Funcionando en http://127.0.0.1:8000
✅ **Frontend React**: Funcionando en http://localhost:8081
✅ **Base de Datos PostgreSQL**: Configurada y poblada con datos
✅ **Sidebar**: Corregido - ya no desaparece al hacer hover

---

## 👥 Usuarios Creados

El sistema incluye 3 usuarios principales para probar todas las funcionalidades:

### 1. Administrador
- **Email**: admin@enapu.com
- **Contraseña**: admin123
- **Rol**: ADMINISTRADOR
- **Acceso**: Dashboard de administración, gestión de usuarios, reportes, configuración del sistema

### 2. Operario
- **Email**: operario@enapu.com
- **Contraseña**: operario123
- **Rol**: OPERARIO
- **Acceso**: Panel de operaciones, validación de tickets, registro de ingresos/salidas, monitoreo

### 3. Cliente
- **Email**: cliente@empresa.com
- **Contraseña**: cliente123
- **Rol**: CLIENTE
- **Empresa**: Transportes García SAC
- **Acceso**: Creación de tickets, consulta de historial, gestión de flota

---

## 📊 Datos Iniciales Creados

### Zonas
- **Zona A**: Capacidad 100
- **Zona B**: Capacidad 150
- **Zona C**: Capacidad 120

### Slots
- **Total**: 450 ubicaciones
- Distribución: 5 filas × 10 columnas × 3 niveles por zona

### Buques
1. MSC MAYA (MSC)
2. MAERSK ESSEX (MAERSK)
3. EVERGREEN HARMONY (EVERGREEN)

### Contenedores
- 20 contenedores creados
- Tipos: 20FT, 40FT, 40HC
- Asignados a diferentes buques

### Tickets
- 10 tickets de ejemplo
- Estados: Pendiente, Validado, En Cola, En Proceso, Completado

---

## 🛠️ Funcionalidades Implementadas

### Backend (Django REST Framework)

#### ✅ API Endpoints Completos

**Usuarios** (`/api/usuarios/`)
- `GET /api/usuarios/` - Listar todos los usuarios
- `POST /api/usuarios/` - Crear nuevo usuario
- `GET /api/usuarios/{id}/` - Obtener usuario específico
- `PUT /api/usuarios/{id}/` - Actualizar usuario
- `DELETE /api/usuarios/{id}/` - Eliminar usuario
- `POST /api/usuarios/login/` - Autenticación de usuario
- `GET /api/usuarios/by_role/?role={rol}` - Filtrar por rol

**Tickets** (`/api/tickets/`)
- `GET /api/tickets/` - Listar todos los tickets
- `POST /api/tickets/` - Crear nuevo ticket
- `GET /api/tickets/{id}/` - Obtener ticket específico
- `PATCH /api/tickets/{id}/` - Actualizar ticket
- `DELETE /api/tickets/{id}/` - Eliminar ticket
- `GET /api/tickets/by_estado/?estado={estado}` - Filtrar por estado
- `GET /api/tickets/by_usuario/?usuario_id={id}` - Filtrar por usuario
- `PATCH /api/tickets/{id}/cambiar_estado/` - Cambiar estado del ticket

**Contenedores** (`/api/contenedores/`)
- CRUD completo para contenedores

**Zonas y Slots** (`/api/zonas/`, `/api/slots/`)
- Gestión de ubicaciones y slots

**Buques** (`/api/buques/`)
- CRUD completo para buques

**Roles y Niveles** (`/api/roles/`, `/api/niveles/`)
- Gestión de roles y niveles de acceso

### Frontend (React + TypeScript)

#### ✅ Componentes Implementados

**Autenticación**
- Login con API real
- Almacenamiento de sesión en localStorage
- Redirección según rol

**Sidebar Mejorado**
- ✅ **SOLUCIONADO**: Ya no desaparece al hacer hover
- Posición sticky
- Navegación persistente
- Estilos mejorados

**Dashboards**
- Admin Dashboard
- Operator Panel
- Client Dashboard

**Servicios API**
- Cliente de API completo (`src/lib/api.ts`)
- Funciones para todos los endpoints
- Manejo de errores

---

## 🔧 Configuración y Ejecución

### Backend

```bash
# Activar entorno virtual
cd backend
.venv\Scripts\Activate.ps1

# Instalar dependencias (si es necesario)
pip install Django djangorestframework django-cors-headers django-environ psycopg2-binary

# Aplicar migraciones
python manage.py migrate

# Crear datos iniciales (ya ejecutado)
python manage.py create_initial_data

# Iniciar servidor
python manage.py runserver
```

### Frontend

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

---

## 🔐 Seguridad

- Contraseñas hasheadas con PBKDF2-SHA256
- CORS configurado para desarrollo
- Autenticación de sesión
- Validación de datos en backend

---

## 📝 Cambios Realizados

### 1. ✅ Sidebar Corregido
- Agregado `position: sticky`
- Mejorado el hover sin desaparecer
- Mejor estructura de layout

### 2. ✅ Modelo Usuario Mejorado
- Campos añadidos: email, password, telefono, empresa, activo
- Timestamps automáticos
- Email único

### 3. ✅ Sistema de Autenticación
- Login funcional con API
- Validación de credenciales
- Gestión de sesiones

### 4. ✅ CRUD Completo
- ViewSets con endpoints personalizados
- Serializers con campos relacionados
- Filtros y búsquedas

### 5. ✅ Datos de Prueba
- 3 usuarios principales
- 450 slots
- 20 contenedores
- 10 tickets de ejemplo

---

## 🌐 URLs del Sistema

- **Frontend**: http://localhost:8081
- **Backend API**: http://127.0.0.1:8000/api
- **Admin Django**: http://127.0.0.1:8000/admin

---

## 📦 Estructura de Base de Datos

```
Rol
├── ADMINISTRADOR
├── OPERARIO
└── CLIENTE

Usuario
├── email (único)
├── password (hasheado)
├── id_rol (FK a Rol)
└── activo (boolean)

Ticket
├── estado (Pendiente/Validado/En Cola/En Proceso/Completado)
├── id_usuario (FK a Usuario)
├── id_contenedor (FK a Contenedor)
└── id_ubicacion (FK a UbicacionSlot)

Contenedor
├── tipo (20FT/40FT/40HC)
├── id_buque (FK a Buque)
└── id_cita_recojo (FK a CitaRecojo)
```

---

## 🎯 Próximos Pasos Sugeridos

1. Implementar autenticación con JWT tokens
2. Agregar paginación a las listas
3. Implementar búsqueda avanzada
4. Agregar validaciones en formularios
5. Crear reportes descargables
6. Implementar notificaciones en tiempo real
7. Agregar tests unitarios

---

## 🐛 Problemas Resueltos

✅ Sidebar desaparece al hacer hover → **SOLUCIONADO**
✅ Conexión frontend-backend → **FUNCIONANDO**
✅ Usuarios no se guardaban en BD → **SOLUCIONADO**
✅ Modelo Usuario sin campos necesarios → **ACTUALIZADO**
✅ Datos iniciales faltantes → **CREADOS**

---

## 📞 Credenciales de Prueba

Para probar rápidamente el sistema:

| Rol | Email | Contraseña | Ruta |
|-----|-------|------------|------|
| Admin | admin@enapu.com | admin123 | /admin/dashboard |
| Operario | operario@enapu.com | operario123 | /operator/panel |
| Cliente | cliente@empresa.com | cliente123 | /client/dashboard |

---

¡El sistema está completamente funcional y listo para usar! 🎉
