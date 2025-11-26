"""
Configuración del panel de administración de Django para la aplicación 'core'.

Registra todos los modelos de la aplicación 'core' en el sitio de administración
para permitir la gestión CRUD (Crear, Leer, Actualizar, Borrar) a través de la interfaz web.
"""
from django.contrib import admin
from .models import (
    Rol, NivelAcceso, Usuario, Zona, UbicacionSlot, Buque,
    CitaRecojo, Contenedor, Ticket, Factura, Pago, Reporte
)

models = [Rol, NivelAcceso, Usuario, Zona, UbicacionSlot, Buque,
          CitaRecojo, Contenedor, Ticket, Factura, Pago, Reporte]

for m in models:
    admin.site.register(m)
