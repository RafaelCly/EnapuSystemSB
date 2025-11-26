"""
Definición de las rutas de la API REST para la aplicación 'core'.

Utiliza Django REST Framework Routers para generar automáticamente 
los endpoints de las operaciones CRUD (ViewSets) para todos los modelos.
"""
from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'roles', views.RolViewSet)
router.register(r'niveles', views.NivelAccesoViewSet)
router.register(r'usuarios', views.UsuarioViewSet)
router.register(r'zonas', views.ZonaViewSet)
router.register(r'ubicaciones-slot', views.UbicacionSlotViewSet)
router.register(r'buques', views.BuqueViewSet)
router.register(r'citas-recojo', views.CitaRecojoViewSet)
router.register(r'contenedores', views.ContenedorViewSet)
router.register(r'tickets', views.TicketViewSet)
router.register(r'facturas', views.FacturaViewSet)
router.register(r'pagos', views.PagoViewSet)
router.register(r'reportes', views.ReporteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
