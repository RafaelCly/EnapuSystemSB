# Guía de Estilo y Mejores Prácticas de Desarrollo

Este documento establece los estándares de codificación y mejores prácticas para el desarrollo del sistema ENAPU. El objetivo es mantener un código consistente, legible y mantenible en todo el proyecto.

## Tabla de Contenidos

1. [Nomenclatura (Naming Conventions)](#nomenclatura-naming-conventions)
2. [Manejo de Errores y Logs](#manejo-de-errores-y-logs)
3. [Estructura de Carpetas (Project Structure)](#estructura-de-carpetas-project-structure)
4. [Estándares de Código](#estándares-de-código)
5. [Documentación](#documentación)
6. [Control de Versiones](#control-de-versiones)

---

## Nomenclatura (Naming Conventions)

### Reglas Generales

- **Idioma**: Usar **español** para nombres de dominio del negocio (modelos, servicios relacionados con ENAPU) e **inglés** para funciones técnicas genéricas.
- **Claridad**: Los nombres deben ser descriptivos y autoexplicativos. Evitar abreviaciones crípticas.
- **Consistencia**: Mantener el mismo patrón de nomenclatura en todo el proyecto.

#### ✅ Buenos ejemplos
```python
# Dominio del negocio en español
class CitaRecojo:
    fecha_programada: datetime
    
def crear_contenedor(numero_contenedor: str):
    pass

# Funciones técnicas en inglés
def validate_input(data: dict):
    pass

def format_response(response_data: dict):
    pass
```

#### ❌ Malos ejemplos
```python
# Abreviaciones crípticas
def proc_ct(num_ct):
    pass

# Inconsistencia de idioma
class AppointmentRecojo:
    scheduled_fecha: datetime
```

### Backend (Python/Django)

#### Variables y Funciones
- **snake_case** para variables, funciones y métodos
- Nombres descriptivos que indiquen la acción o propósito

```python
# Variables
usuario_actual = request.user
fecha_inicio = datetime.now()
lista_contenedores = []

# Funciones
def obtener_citas_disponibles():
    pass

def validar_numero_contenedor(numero: str):
    pass

def calcular_duracion_viaje():
    pass
```

#### Clases y Modelos
- **PascalCase** para clases y modelos de Django
- Nombres en singular para modelos

```python
class Usuario(models.Model):
    pass

class CitaRecojo(models.Model):
    pass

class Contenedor(models.Model):
    pass

class ServicioNotificacion:
    pass
```

#### Constantes
- **UPPER_SNAKE_CASE** para constantes

```python
MAX_CONTENEDORES_POR_CITA = 5
ESTADOS_TICKET = {
    'PENDIENTE': 'pendiente',
    'EN_PROCESO': 'en_proceso',
    'COMPLETADO': 'completado'
}
DEFAULT_DURACION_VIAJE_DIAS = 7
```

#### APIs y URLs
- **kebab-case** para URLs
- Nombres descriptivos y RESTful

```python
# urls.py
urlpatterns = [
    path('api/citas-recojo/', views.CitasRecojoListView.as_view()),
    path('api/contenedores/<str:numero>/', views.ContenedorDetailView.as_view()),
    path('api/usuarios/perfil/', views.UsuarioPerfilView.as_view()),
]
```

### Frontend (TypeScript/React)

#### Variables y Funciones
- **camelCase** para variables, funciones y métodos

```typescript
// Variables
const usuarioActual = useAuth();
const fechaSeleccionada = new Date();
const listaTickets = [];

// Funciones
const obtenerDatosUsuario = async () => {};
const validarFormulario = (datos: FormData) => {};
const formatearFecha = (fecha: Date) => {};
```

#### Componentes React
- **PascalCase** para componentes
- Nombres descriptivos que indiquen la funcionalidad

```typescript
// Componentes
export const LoginForm = () => {};
export const TicketCard = () => {};
export const CitasTable = () => {};
export const ContenedorDetail = () => {};

// Hooks personalizados
export const useAuth = () => {};
export const useCitas = () => {};
export const useNotifications = () => {};
```

#### Interfaces y Types
- **PascalCase** con prefijo `I` para interfaces (opcional)
- **PascalCase** para types

```typescript
interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

interface CitaRecojo {
  id: number;
  fechaProgramada: string;
  contenedores: Contenedor[];
}

type EstadoTicket = 'pendiente' | 'en_proceso' | 'completado';
type TipoUsuario = 'admin' | 'operador' | 'cliente';
```

#### Constantes y Enums
- **UPPER_SNAKE_CASE** para constantes
- **PascalCase** para enums

```typescript
// Constantes
export const API_BASE_URL = 'http://localhost:8000/api';
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const DEFAULT_PAGE_SIZE = 20;

// Enums
export enum EstadosTicket {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  COMPLETADO = 'completado'
}
```

---

## Manejo de Errores y Logs

### Niveles de Logging

Establecemos la siguiente taxonomía de niveles de logging:

| Nivel | Uso | Ejemplo |
|-------|-----|---------|
| **DEBUG** | Información detallada para depuración | Variables internas, flujo de ejecución |
| **INFO** | Información general del funcionamiento | Inicio/fin de procesos, acciones del usuario |
| **WARNING** | Situaciones inesperadas que no impiden el funcionamiento | Valores por defecto utilizados, validaciones fallidas |
| **ERROR** | Errores que impiden completar una operación | Fallos en base de datos, APIs externas |
| **FATAL/CRITICAL** | Errores críticos que pueden detener la aplicación | Fallos de configuración, pérdida de conectividad |

### Formato Estándar de Logs

**Formato**: `[TIMESTAMP] [LEVEL] [MÓDULO] [USUARIO]: MENSAJE`

#### Ejemplos
```
[2024-11-11 14:30:22] [INFO] [auth] [usuario@email.com]: Login exitoso
[2024-11-11 14:31:45] [ERROR] [citas] [admin]: Error al crear cita - contenedor no encontrado: CONT001
[2024-11-11 14:32:10] [WARNING] [notifications] [sistema]: Servicio de email temporalmente no disponible
[2024-11-11 14:33:00] [DEBUG] [api] [operador1]: Request recibido: POST /api/tickets/
```

### Backend (Python/Django)

#### Configuración de Logging

```python
# settings.py
import logging

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'detailed': {
            'format': '[{asctime}] [{levelname}] [{name}] [{user}]: {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/enapu.log',
            'formatter': 'detailed',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'detailed',
        },
    },
    'root': {
        'handlers': ['file', 'console'],
        'level': 'INFO',
    },
    'loggers': {
        'core': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

#### Manejo de Errores

```python
import logging
from django.http import JsonResponse
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

class CitasService:
    def crear_cita(self, datos_cita: dict, usuario):
        try:
            logger.info(f"Iniciando creación de cita para usuario: {usuario.email}")
            
            # Validar datos
            if not self._validar_datos_cita(datos_cita):
                logger.warning(f"Datos de cita inválidos: {datos_cita}")
                raise ValidationError("Los datos de la cita son inválidos")
            
            # Crear cita
            cita = CitaRecojo.objects.create(**datos_cita)
            logger.info(f"Cita creada exitosamente: {cita.id}")
            
            return cita
            
        except ValidationError as e:
            logger.error(f"Error de validación al crear cita: {e}")
            raise
            
        except Exception as e:
            logger.error(f"Error inesperado al crear cita: {e}", exc_info=True)
            raise Exception("Error interno del servidor")
    
    def _validar_datos_cita(self, datos: dict) -> bool:
        logger.debug(f"Validando datos de cita: {datos}")
        # Lógica de validación
        return True

# Views
def crear_cita_view(request):
    try:
        servicio = CitasService()
        cita = servicio.crear_cita(request.data, request.user)
        
        return JsonResponse({
            'success': True,
            'data': {'cita_id': cita.id}
        })
        
    except ValidationError as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)
        
    except Exception as e:
        logger.error(f"Error en vista crear_cita: {e}")
        return JsonResponse({
            'success': False,
            'error': 'Error interno del servidor'
        }, status=500)
```

### Frontend (TypeScript/React)

#### Configuración de Logging

```typescript
// lib/logger.ts
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
  FATAL = 4
}

class Logger {
  private level: LogLevel = LogLevel.INFO;
  private module: string;

  constructor(module: string) {
    this.module = module;
  }

  private log(level: LogLevel, message: string, data?: any) {
    if (level < this.level) return;

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const usuario = this.getCurrentUser();
    
    const logMessage = `[${timestamp}] [${levelName}] [${this.module}] [${usuario}]: ${message}`;
    
    console.log(logMessage, data || '');
    
    // En producción, enviar a servicio de logging
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(level, logMessage, data);
    }
  }

  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  warning(message: string, data?: any) {
    this.log(LogLevel.WARNING, message, data);
  }

  error(message: string, error?: Error, data?: any) {
    this.log(LogLevel.ERROR, message, { error: error?.message, stack: error?.stack, data });
  }

  fatal(message: string, error?: Error) {
    this.log(LogLevel.FATAL, message, { error: error?.message, stack: error?.stack });
  }

  private getCurrentUser(): string {
    // Obtener usuario actual del contexto de autenticación
    return 'usuario_actual'; // Implementar según el contexto
  }

  private sendToLoggingService(level: LogLevel, message: string, data?: any) {
    // Implementar envío a servicio de logging externo
  }
}

export const createLogger = (module: string) => new Logger(module);
```

#### Manejo de Errores en Componentes

```typescript
// hooks/useErrorHandler.ts
import { createLogger } from '../lib/logger';

const logger = createLogger('ErrorHandler');

export const useErrorHandler = () => {
  const handleError = (error: Error, context: string) => {
    logger.error(`Error en ${context}`, error);
    
    // Mostrar notificación al usuario
    toast.error('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
  };

  const handleApiError = (error: any, operation: string) => {
    logger.error(`Error en API - ${operation}`, error);
    
    if (error.response?.status === 401) {
      // Redirigir a login
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      toast.error('Error del servidor. Por favor, contacta al administrador.');
    } else {
      toast.error(error.response?.data?.message || 'Error en la operación');
    }
  };

  return { handleError, handleApiError };
};

// Ejemplo de uso en componente
const CitasForm = () => {
  const logger = createLogger('CitasForm');
  const { handleError, handleApiError } = useErrorHandler();

  const crearCita = async (datos: CitaData) => {
    try {
      logger.info('Iniciando creación de cita');
      logger.debug('Datos de cita', datos);
      
      const response = await api.post('/citas-recojo/', datos);
      
      logger.info('Cita creada exitosamente', { citaId: response.data.id });
      toast.success('Cita creada exitosamente');
      
    } catch (error) {
      handleApiError(error, 'crear cita');
    }
  };

  return (
    // JSX del componente
  );
};
```

#### Error Boundaries

```typescript
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createLogger } from '../lib/logger';

const logger = createLogger('ErrorBoundary');

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.fatal('Error no manejado en componente', error);
    logger.debug('Información adicional del error', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Algo salió mal</h2>
          <p>Ha ocurrido un error inesperado. Por favor, recarga la página.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Estructura de Carpetas (Project Structure)

### Estructura Raíz del Proyecto

```
enapuu-main/
├── backend/                    
├── src/                       
├── public/                    
├── .env.example
├── .gitignore                  
├── bun.lockb                   
├── CAMBIOS_FINALES.md           
├── coding_guidelines.md
├── components.json
├── eslint.config.js
├── GUIA_GIT.md           
├── index.html         
├── INSTRUCCIONES_COLABORADORES.md     
├── package-lock.json   
├── package.json
├── postcss.config.js
├── PROBLEMAS_SOLUCIONADOS.md
├── README.md
├── requirements.txt
├── SISTEMA_FUNCIONANDO.md
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts 
           
```

### Backend (Django)

```
+---backend
|   |   .env.example
|   |   add_barcodes.py
|   |   add_clients.py
|   |   create_containers_with_citas.py
|   |   create_more_citas.py
|   |   fix_ticket_states.py
|   |   manage.py
|   |   populate_citas.py
|   |   README_BACKEND.md
|   |   update_citas_random_clients.py
|   |   update_db.py
|   |   update_usuario_table.sql
|   |
|   +---backend
|   |       asgi.py
|   |       crea-tablas-ENAPU.sql
|   |       objetos-bd - ENAPU.sql
|   |       poblamiento-datos-ENAPU.sql
|   |       settings.py
|   |       urls.py
|   |       vacia-bd - ENAPU.sql
|   |       wsgi.py
|   |       __init__.py
|   |
|   \---core
|       |   admin.py
|       |   apps.py
|       |   models.py
|       |   serializers.py
|       |   urls.py
|       |   views.py
|       |   __init__.py
|       |
|       +---management
|       |   |   __init__.py
|       |   |
|       |   \---commands
|       |           create_initial_data.py
|       |           __init__.py
|       |
|       \---migrations
|               0001_initial.py
|               0002_citarecojo_duracion_viaje_dias_and_more.py
|               0003_contenedor_numero_contenedor.py
|               __init__.py

```

#### Organización de Models

Para gestionar la complejidad de los modelos, se adoptará una **estructura modular** dentro del directorio `models/` del backend. Esto asegura que ningún archivo de modelos se vuelva demasiado extenso y mejora la mantenibilidad.

##### 1. Estructura de Módulos Sugerida

Los modelos se agruparán por su dominio funcional:

backend/
└── core/
    ├── models/
    │   ├── __init__.py        # Importa todos los modelos para acceso global
    │   ├── base.py            # (Recomendado) Base Model
    │   ├── buques.py          # Contiene el modelo Buque
    │   ├── usuarios.py        # Contiene Rol, NivelAcceso, Usuario
    │   ├── citas.py           # Contiene CitaRecojo, Contenedor
    │   ├── almacenamiento.py  # Contiene Zona, UbicacionSlot
    │   └── transacciones.py   # Contiene Ticket, Factura, Pago, Reporte
    └── ...

##### 2. Archivos de Modelo 

Se utilizará una clase base para incluir campos de auditoría y se adaptarán las relaciones importantes, como el uso de `related_name`.

```python
# core/models/__init__.py
# Centraliza todas las importaciones para que otros módulos solo importen desde aquí
from .usuarios import Rol, NivelAcceso, Usuario
from .buques_contenedores import Buque, Contenedor
from .citas_almacenamiento import Zona, UbicacionSlot, CitaRecojo
from .transacciones import Ticket, Factura, Pago, Reporte

# core/models/base.py
from django.db import models

class BaseModel(models.Model):
    # Campos de auditoría (se usará 'fecha_creacion' y 'fecha_modificacion'
    # de tu modelo 'Usuario' en lugar de created_at/updated_at por consistencia).
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(null=True, blank=True, auto_now=True)
    activo = models.BooleanField(default=True)
    
    class Meta:
        # Esto asegura que la tabla BaseModel no se cree en la BD
        abstract = True

# core/models/usuarios.py
from django.db import models
from .base import BaseModel
# Nota: Si se usara el modelo AbstractUser de Django, la importación sería diferente.
# Aquí se usa el modelo base que hereda los campos de auditoría.

class Rol(models.Model):
    # Definición del modelo Rol
    pass 

class NivelAcceso(models.Model):
    # Definición del modelo NivelAcceso
    pass

class Usuario(BaseModel): 
    # Hereda fecha_creacion, fecha_modificacion y activo. 
    # Nota: Se recomienda que Usuario herede de AbstractUser si es el modelo de autenticación.
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    # ... otros campos ...
    id_rol = models.ForeignKey(Rol, db_column='id_rol', on_delete=models.CASCADE)
    id_nivel_acceso = models.ForeignKey(NivelAcceso, db_column='id_nivel_acceso', on_delete=models.CASCADE)

# Ejemplo de uso de related_name (en core/models/citas_almacenamiento.py)
class CitaRecojo(BaseModel):
    # ... otros campos ...
    id_cliente = models.ForeignKey(
        'usuarios.Usuario',  # Referencia a la app.modelo
        db_column='id_cliente', 
        on_delete=models.CASCADE, 
        related_name='citas_cliente', # Nombre de relación para evitar conflictos
        null=True, blank=True
    )
```

### Organización de Services

Los servicios (Services) encapsulan la **lógica de negocio** (*business logic*) compleja, separándola de las vistas (Views) y los modelos (Models). Esto sigue el principio de **Single Responsibility Principle (SRP)** y facilita las pruebas unitarias.

##### 1. Estructura de Módulos Sugerida

Los servicios deben organizarse en archivos separados, siguiendo la misma agrupación de dominio utilizada en los modelos (usuarios, citas, transacciones, etc.).

backend/core/services/
├── init.py           # Centraliza la importación de todos los servicios
├── base_service.py       # Contiene la clase BaseService
├── auth_service.py       # Lógica de login, registro, roles, niveles de acceso
├── citas_service.py      # Lógica para CitaRecojo, Contenedor, Buque
└── transacciones_service.py # Lógica para Ticket, Factura, Pago, Reporte

##### 2. Estructura del Código

Se utilizará una clase **`BaseService`** abstracta para heredar funcionalidades transversales como el **logging** y el manejo centralizado de excepciones.

```python
# core/services/base_service.py
from abc import ABC, abstractmethod
import logging

# Se utiliza el logger 'core' definido en settings.py
logger = logging.getLogger('core') 

class BaseService(ABC):
    """Clase base abstracta para todos los servicios del core."""
    
    def __init__(self):
        # El logger de cada subclase se nombra automáticamente 
        # con el nombre de la clase (ej. CitasService).
        self.logger = logging.getLogger(self.__class__.__name__)
        self.logger.debug(f"Inicializando {self.__class__.__name__}")
    
    # Aquí se pueden añadir métodos comunes como get_by_id o handle_exception

# core/services/citas_service.py
from django.db import transaction
from .base_service import BaseService
from ..models import CitaRecojo, Contenedor
from django.core.exceptions import ValidationError # Importar errores específicos

class CitasService(BaseService):
    """Servicio para la gestión de Citas de Recojo y Contenedores."""

    @transaction.atomic # Usar decorador para asegurar la atomicidad de DB
    def crear_cita_y_contenedor(self, datos_cita: dict, datos_contenedor: dict):
        try:
            self.logger.info("Iniciando creación de cita y contenedor.")
            
            # 1. Lógica de negocio específica (ej. validar si el cliente es activo)
            # if not datos_cita['id_cliente'].activo: 
            #   raise ValidationError("El cliente debe estar activo.")

            # 2. Creación de la Cita
            cita = CitaRecojo.objects.create(**datos_cita)
            
            # 3. Creación del Contenedor relacionado
            Contenedor.objects.create(id_cita_recojo=cita, **datos_contenedor)
            
            self.logger.info(f"Cita {cita.id} y Contenedor creados con éxito.")
            return cita

        except ValidationError as e:
            self.logger.warning(f"Error de validación: {e}")
            raise 
        except Exception as e:
            self.logger.error(f"Error inesperado al crear cita: {e}", exc_info=True)
            raise Exception("Error interno del servidor al procesar la transacción.")
```


### Frontend (React/TypeScript)

```
src
    |   App.css
    |   App.tsx
    |   index.css
    |   main.tsx
    |   vite-env.d.ts
    |
    +---components
    |   |   AdminLayout.tsx
    |   |   CardStat.tsx
    |   |   DataTable.tsx
    |   |   Navbar.tsx
    |   |   OperatorLayout.tsx
    |   |   QRCard.tsx
    |   |   Sidebar.tsx
    |   |
    |   \---ui
    |           accordion.tsx
    |           alert-dialog.tsx
    |           alert.tsx
    |           aspect-ratio.tsx
    |           avatar.tsx
    |           badge.tsx
    |           breadcrumb.tsx
    |           button.tsx
    |           calendar.tsx
    |           card.tsx
    |           carousel.tsx
    |           chart.tsx
    |           checkbox.tsx
    |           collapsible.tsx
    |           command.tsx
    |           context-menu.tsx
    |           dialog.tsx
    |           drawer.tsx
    |           dropdown-menu.tsx
    |           form.tsx
    |           hover-card.tsx
    |           input-otp.tsx
    |           input.tsx
    |           label.tsx
    |           menubar.tsx
    |           navigation-menu.tsx
    |           pagination.tsx
    |           popover.tsx
    |           progress.tsx
    |           radio-group.tsx
    |           resizable.tsx
    |           scroll-area.tsx
    |           select.tsx
    |           separator.tsx
    |           sheet.tsx
    |           sidebar.tsx
    |           skeleton.tsx
    |           slider.tsx
    |           sonner.tsx
    |           switch.tsx
    |           table.tsx
    |           tabs.tsx
    |           textarea.tsx
    |           toast.tsx
    |           toaster.tsx
    |           toggle-group.tsx
    |           toggle.tsx
    |           tooltip.tsx
    |           use-toast.ts
    |
    +---data
    |       mocks.js
    |
    +---hooks
    |       use-mobile.tsx
    |       use-toast.ts
    |
    +---lib
    |       api.ts
    |       utils.ts
    |
    \---pages
        |   NotFound.tsx
        |
        +---admin
        |       AdminDashboard.tsx
        |       ContenedoresView.tsx
        |       ReportsView.tsx
        |       SlotsView.tsx
        |       SystemConfigView.tsx
        |       SystemMonitor.tsx
        |       UsersView.tsx
        |       ZonasView.tsx
        |
        +---auth
        |       Login.tsx
        |
        +---client
        |       ClientDashboard.tsx
        |       FleetManagement.tsx
        |       History.tsx
        |       MyTickets.tsx
        |       NewTicket.tsx
        |       Notifications.tsx
        |       Profile.tsx
        |       ReservarCita.tsx
        |
        \---operator
                OperatorPanel.tsx
                QuickContainerQuery.tsx
                RegisterEntry.tsx
                RegisterExit.tsx
                ScanTicket.tsx
                TurnMonitor.tsx
                ValidateTicket.tsx
```

#### Organización de Types

En el proyecto actual, los tipos se definen localmente en cada componente según sea necesario. Se recomienda crear una estructura centralizada para mayor mantenibilidad:

**Estructura Actual (Inline Types):**
```typescript
// En cada componente se definen tipos específicos
// Ejemplo: src/pages/client/ReservarCita.tsx
interface Contenedor {
  id: number;
  codigo_barras: string;
  tipo: string;
  peso: number;
  dimensiones: string;
}

interface Buque {
  id: number;
  nombre: string;
  linea_naviera: string;
}

// Ejemplo: src/pages/operator/ScanTicket.tsx
interface ContenedorInfo {
  id: number;
  codigo_barras: string;
  tipo: string;
  peso: number;
  dimensiones: string;
  buque_nombre: string;
  cita_info: {
    fecha_envio: string;
    fecha_recojo: string;
    cliente: string;
    estado: string;
  } | null;
}

interface Zona {
  id: number;
  nombre: string;
}

interface Slot {
  id: number;
  fila: string;
  columna: string;
  nivel: string;
}
```

**Estructura Recomendada (Centralizada):**
```typescript
// types/index.ts - Barrel exports
export * from './auth.types';
export * from './contenedor.types';
export * from './cita.types';
export * from './usuario.types';
export * from './buque.types';
export * from './zona.types';
export * from './api.types';

// types/api.types.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// types/contenedor.types.ts
export interface Contenedor {
  id: number;
  codigo_barras: string;
  tipo: string;
  peso: number;
  dimensiones: string;
  buque_nombre?: string;
}

export interface ContenedorInfo extends Contenedor {
  cita_info: {
    fecha_envio: string;
    fecha_recojo: string;
    cliente: string;
    estado: string;
  } | null;
}

// types/cita.types.ts
export interface CitaRecojo {
  id: number;
  fecha_programada: string;
  hora_inicio: string;
  hora_fin: string;
  estado: EstadoCita;
  contenedores: Contenedor[];
  cliente_id: number;
  created_at: string;
  updated_at: string;
}

export enum EstadoCita {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  EN_PROCESO = 'en_proceso',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada'
}

// types/buque.types.ts
export interface Buque {
  id: number;
  nombre: string;
  linea_naviera: string;
}

// types/zona.types.ts
export interface Zona {
  id: number;
  nombre: string;
}

export interface Slot {
  id: number;
  fila: string;
  columna: string;
  nivel: string;
  zona_id: number;
  ocupado: boolean;
}

// types/ticket.types.ts
export interface Ticket {
  id: number;
  contenedor_id: string;
  transportista: string;
  placa: string;
  conductor: string;
  estado: EstadoTicket;
  turno: string;
  fecha: string;
  qr_code: string;
  cliente_id: number;
  slot: string;
  prioridad: PrioridadTicket;
}

export enum EstadoTicket {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado'
}

export enum PrioridadTicket {
  BAJA = 'baja',
  NORMAL = 'normal',
  ALTA = 'alta',
  URGENTE = 'urgente'
}

// types/usuario.types.ts
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  role: TipoUsuario;
  phone: string;
  active: boolean;
}

export enum TipoUsuario {
  ADMIN = 'ADMIN',
  OPERARIO = 'OPERARIO',
  CLIENTE = 'CLIENTE'
}
```

#### Organización de Services

**Estructura Actual (lib/api.ts):**
El proyecto maneja las llamadas a la API de manera centralizada usando una función `apiFetch` y un objeto `api` con métodos organizados por entidad:

```typescript
// lib/api.ts (Implementación actual)
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  } as Record<string, string>;

  const resp = await fetch(url, { ...opts, headers, credentials: 'include' });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`${resp.status} ${resp.statusText}: ${text}`);
  }
  
  // Parsear JSON o devolver texto
  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) return resp.json();
  return resp.text();
}

// Objeto API con métodos organizados por entidad
export const api = {
  // Usuarios
  usuarios: {
    list: () => apiFetch('/usuarios/'),
    get: (id: number) => apiFetch(`/usuarios/${id}/`),
    create: (data: any) => apiFetch('/usuarios/', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    update: (id: number, data: any) => apiFetch(`/usuarios/${id}/`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
    delete: (id: number) => apiFetch(`/usuarios/${id}/`, { method: 'DELETE' }),
    login: (email: string, password: string) => 
      apiFetch('/usuarios/login/', { 
        method: 'POST', 
        body: JSON.stringify({ email, password }) 
      }),
    byRole: (role: string) => apiFetch(`/usuarios/by_role/?role=${role}`),
  },

  // Tickets
  tickets: {
    list: () => apiFetch('/tickets/'),
    get: (id: number) => apiFetch(`/tickets/${id}/`),
    create: (data: any) => apiFetch('/tickets/', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    update: (id: number, data: any) => apiFetch(`/tickets/${id}/`, { 
      method: 'PATCH', 
      body: JSON.stringify(data) 
    }),
    delete: (id: number) => apiFetch(`/tickets/${id}/`, { method: 'DELETE' }),
    byEstado: (estado: string) => apiFetch(`/tickets/by_estado/?estado=${estado}`),
    byUsuario: (usuarioId: number) => apiFetch(`/tickets/by_usuario/?usuario_id=${usuarioId}`),
    cambiarEstado: (id: number, estado: string) => 
      apiFetch(`/tickets/${id}/cambiar_estado/`, { 
        method: 'PATCH', 
        body: JSON.stringify({ estado }) 
      }),
  },

  // Contenedores
  contenedores: {
    list: () => apiFetch('/contenedores/'),
    get: (id: number) => apiFetch(`/contenedores/${id}/`),
    create: (data: any) => apiFetch('/contenedores/', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    update: (id: number, data: any) => apiFetch(`/contenedores/${id}/`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
    delete: (id: number) => apiFetch(`/contenedores/${id}/`, { method: 'DELETE' }),
  },

  // Zonas
  zonas: {
    list: () => apiFetch('/zonas/'),
    get: (id: number) => apiFetch(`/zonas/${id}/`),
  },

  // Slots
  slots: {
    list: () => apiFetch('/slots/'),
    get: (id: number) => apiFetch(`/slots/${id}/`),
    update: (id: number, data: any) => apiFetch(`/slots/${id}/`, { 
      method: 'PATCH', 
      body: JSON.stringify(data) 
    }),
  },

  // Buques
  buques: {
    list: () => apiFetch('/buques/'),
    get: (id: number) => apiFetch(`/buques/${id}/`),
    create: (data: any) => apiFetch('/buques/', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  },

  // Roles y Niveles de acceso
  roles: {
    list: () => apiFetch('/roles/'),
  },

  niveles: {
    list: () => apiFetch('/niveles/'),
  },
};
```

**Estructura Recomendada (Servicios Especializados):**
Para mayor escalabilidad y mantenibilidad, se recomienda crear servicios especializados:

```typescript
// services/base.service.ts
export abstract class BaseApiService {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
  }

  protected async request<T>(
    path: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const response = await fetch(url, { 
      ...options, 
      headers, 
      credentials: 'include' 
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status} ${response.statusText}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }
    return response.text() as unknown as T;
  }

  protected handleError(error: Error, operation: string) {
    console.error(`Error en ${operation}:`, error);
    throw error;
  }
}

// services/usuario.service.ts
import { BaseApiService } from './base.service';
import { Usuario, TipoUsuario } from '../types';

export class UsuarioService extends BaseApiService {
  async obtenerUsuarios(): Promise<Usuario[]> {
    try {
      return await this.request<Usuario[]>('/usuarios/');
    } catch (error) {
      this.handleError(error as Error, 'obtener usuarios');
      throw error;
    }
  }

  async obtenerUsuario(id: number): Promise<Usuario> {
    try {
      return await this.request<Usuario>(`/usuarios/${id}/`);
    } catch (error) {
      this.handleError(error as Error, 'obtener usuario');
      throw error;
    }
  }

  async crearUsuario(datos: Omit<Usuario, 'id'>): Promise<Usuario> {
    try {
      return await this.request<Usuario>('/usuarios/', {
        method: 'POST',
        body: JSON.stringify(datos),
      });
    } catch (error) {
      this.handleError(error as Error, 'crear usuario');
      throw error;
    }
  }

  async login(email: string, password: string): Promise<{ token: string; user: Usuario }> {
    try {
      return await this.request<{ token: string; user: Usuario }>('/usuarios/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    } catch (error) {
      this.handleError(error as Error, 'login de usuario');
      throw error;
    }
  }

  async obtenerUsuariosPorRol(role: TipoUsuario): Promise<Usuario[]> {
    try {
      return await this.request<Usuario[]>(`/usuarios/by_role/?role=${role}`);
    } catch (error) {
      this.handleError(error as Error, 'obtener usuarios por rol');
      throw error;
    }
  }
}

// services/contenedor.service.ts
import { BaseApiService } from './base.service';
import { Contenedor, ContenedorInfo } from '../types';

export class ContenedorService extends BaseApiService {
  async obtenerContenedores(): Promise<Contenedor[]> {
    try {
      return await this.request<Contenedor[]>('/contenedores/');
    } catch (error) {
      this.handleError(error as Error, 'obtener contenedores');
      throw error;
    }
  }

  async obtenerContenedor(id: number): Promise<ContenedorInfo> {
    try {
      return await this.request<ContenedorInfo>(`/contenedores/${id}/`);
    } catch (error) {
      this.handleError(error as Error, 'obtener contenedor');
      throw error;
    }
  }

  async crearContenedor(datos: Omit<Contenedor, 'id'>): Promise<Contenedor> {
    try {
      return await this.request<Contenedor>('/contenedores/', {
        method: 'POST',
        body: JSON.stringify(datos),
      });
    } catch (error) {
      this.handleError(error as Error, 'crear contenedor');
      throw error;
    }
  }
}

// services/index.ts - Barrel exports e instancias singleton
export { BaseApiService } from './base.service';
export { UsuarioService } from './usuario.service';
export { ContenedorService } from './contenedor.service';
export { TicketService } from './ticket.service';

// Instancias singleton
export const usuarioService = new UsuarioService();
export const contenedorService = new ContenedorService();
export const ticketService = new TicketService();
```

**Uso en Componentes:**
```typescript
// Uso actual (directo)
import { api } from '@/lib/api';

// En el componente
const usuarios = await api.usuarios.list();

// Uso recomendado (con servicios)
import { usuarioService } from '@/services';

// En el componente
const usuarios = await usuarioService.obtenerUsuarios();
```

---

## Estándares de Código

### Formateo y Estilo

#### Backend (Python)
- Usar **Black** para formateo automático
- Líneas máximo de **88 caracteres**
- Usar **isort** para importaciones
- Seguir **PEP 8**

```python
# .black
[tool.black]
line-length = 88
target-version = ['py39']
include = '\.pyi?$'

# .isort.cfg
[settings]
multi_line_output = 3
include_trailing_comma = True
force_grid_wrap = 0
line_length = 88
```

#### Frontend (TypeScript)
- Usar **Prettier** para formateo
- Usar **ESLint** para linting
- **2 espacios** para indentación
- **Comillas simples** para strings

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Comentarios y Documentación

#### Backend
```python
class CitasService:
    """
    Servicio para manejar las operaciones relacionadas con citas de recojo.
    
    Este servicio encapsula la lógica de negocio para:
    - Crear y validar citas
    - Gestionar disponibilidad de slots
    - Calcular duraciones de viaje
    """
    
    def crear_cita(self, datos_cita: dict, usuario: Usuario) -> CitaRecojo:
        """
        Crea una nueva cita de recojo.
        
        Args:
            datos_cita (dict): Datos de la cita a crear
            usuario (Usuario): Usuario que solicita la cita
            
        Returns:
            CitaRecojo: La cita creada
            
        Raises:
            ValidationError: Si los datos no son válidos
            IntegrityError: Si hay conflictos con citas existentes
        """
        pass
```

#### Frontend
```typescript
/**
 * Hook personalizado para manejar la autenticación del usuario.
 * 
 * Proporciona funciones para login, logout, y verificación de estado
 * de autenticación. Maneja automáticamente el almacenamiento del token
 * y la renovación de sesión.
 * 
 * @returns {Object} Objeto con estado y funciones de autenticación
 */
export const useAuth = () => {
  // Implementación
};

/**
 * Formatea una fecha para mostrar en la interfaz de usuario.
 * 
 * @param fecha - La fecha a formatear
 * @param formato - El formato deseado ('short' | 'long' | 'time')
 * @returns La fecha formateada como string
 */
export const formatearFecha = (fecha: Date, formato: 'short' | 'long' | 'time' = 'short'): string => {
  // Implementación
};
```

---

## Documentación

### README Files

Cada módulo principal debe tener su propio README con:
- Propósito del módulo
- Instrucciones de instalación/configuración
- Ejemplos de uso
- API documentation (si aplica)

### API Documentation

- Usar **Django REST Framework** auto-documentation
- Documentar todos los endpoints con ejemplos
- Incluir códigos de error y respuestas

### Code Documentation

- Documentar todas las funciones públicas
- Incluir ejemplos de uso en docstrings
- Mantener documentación actualizada

---

## Control de Versiones

### Mensajes de Commit

Usar **Conventional Commits**:

```
<tipo>[scope opcional]: <descripción>

[cuerpo opcional]

[footer opcional]
```

#### Tipos de commit:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan la lógica)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

#### Ejemplos:
```
feat(citas): agregar validación de slots disponibles

fix(auth): corregir redirección después del login

docs(api): actualizar documentación de endpoints de contenedores

refactor(services): extraer lógica común de servicios a clase base
```

### Branching Strategy

- `main`: Código en producción
- `develop`: Código en desarrollo
- `feature/nombre-feature`: Nuevas funcionalidades
- `fix/nombre-bug`: Corrección de bugs
- `release/v1.0.0`: Preparación de releases

### Pull Requests

Todo PR debe incluir:
- Descripción clara del cambio
- Tests que cubran la funcionalidad
- Documentación actualizada (si aplica)
- Review de al menos un otro desarrollador

---

Este documento es una guía viva que debe actualizarse según evolucione el proyecto. Todos los miembros del equipo deben familiarizarse con estas convenciones y aplicarlas consistentemente.