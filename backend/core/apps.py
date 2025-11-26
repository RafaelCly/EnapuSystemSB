"""
Configuración de la aplicación principal 'core'.

Define los metadatos de configuración para la aplicación Django.
"""
from django.apps import AppConfig


class CoreConfig(AppConfig):
    """
    Clase de configuración principal para la aplicación 'core'.
    
    Establece el tipo de campo automático por defecto y el nombre de la aplicación.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
