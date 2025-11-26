# 🚢 Sistema de Gestión Portuaria ENAPU

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)

Sistema integral de gestión portuaria para el control de contenedores, tickets, ubicaciones y operaciones portuarias con backend Django + API REST y frontend React + TypeScript.

## �️ Tecnologías

### Backend
- **Django 5.2.8** - Framework web Python
- **Django REST Framework** - API REST
- **PostgreSQL** - Base de datos
- **django-cors-headers** - CORS
- **django-environ** - Gestión de variables de entorno

### Frontend
- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **React Router** - Enrutamiento

## 📋 Características

### Por Rol de Usuario

**👤 Cliente:**
- Dashboard con resumen de tickets
- Generación de nuevos tickets con QR
- Consulta de tickets activos
- Historial de operaciones
- Gestión de flota de vehículos
- Notificaciones en tiempo real
- Perfil de usuario

**🔧 Operario:**
- Panel de operaciones completo
- Validación de tickets con QR
- Registro de ingresos y salidas
- Monitor de turnos en tiempo real
- Consulta rápida de contenedores

**⚙️ Administrador:**
- Dashboard con estadísticas generales
- Vista de usuarios (solo lectura)
- Configuración del sistema (solo lectura)
- Reportes y analítica
- Monitor de logs del sistema

## � Requisitos

- **Node.js** v18 o superior
- **Python** v3.10 o superior
- **PostgreSQL** v14 o superior
- **Git**

## 🚀 Instalación Rápida

### Para Colaboradores del Proyecto

⚠️ **IMPORTANTE:** Lee primero **[INSTRUCCIONES_COLABORADORES.md](./INSTRUCCIONES_COLABORADORES.md)** para guía completa paso a paso.

### Resumen de Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/RafaelCly/ENAPUU.git
cd ENAPUU

# 2. Configurar Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
python manage.py migrate
python manage.py create_initial_data
python manage.py runserver

# 3. Configurar Frontend (en otra terminal)
cd ..
npm install
npm run dev
```

### Usuarios de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| Administrador | admin@enapu.com | admin123 |
| Operario | operario@enapu.com | operario123 |
| Cliente | cliente@empresa.com | cliente123 |

## 🎯 Uso del Sistema

### Login Simulado
Al iniciar, selecciona uno de los tres roles:
- **Cliente** → Gestiona tickets y flota
- **Operario** → Valida y procesa operaciones
- **Administrador** → Vista general del sistema

### Datos de Prueba
El sistema incluye datos mock en `/src/data/mocks.js`:
- 10 tickets de ejemplo
- 7 turnos
- 6 contenedores
- 10 slots portuarios
- 7 vehículos de flota
- 5 usuarios
- Notificaciones y logs del sistema

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes shadcn/ui
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── CardStat.tsx
│   ├── DataTable.tsx
│   └── QRCard.tsx
├── pages/              # Páginas por rol
│   ├── auth/           # Login
│   ├── client/         # Vistas de cliente
│   ├── operator/       # Vistas de operario
│   └── admin/          # Vistas de administrador
├── data/
│   └── mocks.js        # Datos simulados
├── lib/
│   └── utils.ts
├── App.tsx
├── index.css           # Estilos y design system
└── main.tsx
```

## 🎨 Design System

El proyecto utiliza un sistema de diseño institucional basado en:
- **Color primario:** Navy Blue (#003366)
- **Acentos:** Celeste/Sky Blue
- **Tokens semánticos** en HSL
- **Componentes con variantes**
- **Responsive** para desktop, tablet y mobile

## 📚 Documentación

- **[INSTRUCCIONES_COLABORADORES.md](./INSTRUCCIONES_COLABORADORES.md)** - Guía completa de configuración
- **[GUIA_GIT.md](./GUIA_GIT.md)** - Guía de Git para el equipo
- **[backend/README_BACKEND.md](./backend/README_BACKEND.md)** - Documentación del API

## 🤝 Contribuir

1. Lee **[GUIA_GIT.md](./GUIA_GIT.md)** antes de empezar
2. Crea una rama: `git checkout -b feature/mi-feature`
3. Commit: `git commit -m 'feat: Agregar nueva funcionalidad'`
4. Push: `git push origin feature/mi-feature`
5. Abre un Pull Request

### Convenciones de Commits

```
feat:     Nueva funcionalidad
fix:      Corrección de bug
docs:     Cambios en documentación
refactor: Refactorización de código
```

## � Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Rafael Cly**
- GitHub: [@RafaelCly](https://github.com/RafaelCly)
- Repositorio: [ENAPUU](https://github.com/RafaelCly/ENAPUU)

---

**Última actualización:** 11 de noviembre de 2025
**Versión:** 1.0.0
