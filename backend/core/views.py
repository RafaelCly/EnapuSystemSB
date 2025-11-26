"""
Vistas y ViewSets de la API REST para la aplicación 'core'.

Implementa los endpoints CRUD (Crear, Leer, Actualizar, Borrar) y acciones 
personalizadas para la lógica de negocio, incluyendo el manejo de autenticación 
y la consulta de tickets.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
# C0415 Corregido: Mover importación de django.utils a la parte superior
from django.utils import timezone
from .models import (
    Rol, NivelAcceso, Usuario, Zona, UbicacionSlot, Buque,
    CitaRecojo, Contenedor, Ticket, Factura, Pago, Reporte
)
from .serializers import (
    RolSerializer, NivelAccesoSerializer, UsuarioSerializer, ZonaSerializer,
    UbicacionSlotSerializer, BuqueSerializer, CitaRecojoSerializer, ContenedorSerializer,
    TicketSerializer, FacturaSerializer, PagoSerializer, ReporteSerializer
)


class RolViewSet(viewsets.ModelViewSet):
    """ViewSet para el modelo Rol, permitiendo operaciones CRUD."""
    queryset = Rol.objects.all()
    serializer_class = RolSerializer


class NivelAccesoViewSet(viewsets.ModelViewSet):
    """ViewSet para el modelo NivelAcceso, permitiendo operaciones CRUD."""
    queryset = NivelAcceso.objects.all()
    serializer_class = NivelAccesoSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    """ViewSet para el modelo Usuario, con acción personalizada para el login."""
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Permite a un usuario autenticarse mediante email y contraseña.
        
        Realiza la verificación de hash de contraseña y retorna los datos del usuario.
        """
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Email y contraseña son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # C0301 Corregido: Línea larga
            usuario = Usuario.objects.select_related(
                'id_rol', 'id_nivel_acceso'
            ).get(email=email, activo=True)

            if check_password(password, usuario.password):
                serializer = self.get_serializer(usuario)
                return Response({
                    'user': serializer.data,
                    'message': 'Login exitoso'
                })

            # R1705 Corregido: Eliminado 'else' innecesario
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Usuario.DoesNotExist:
            return Response(
                {'error': 'Usuario no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    @action(detail=False, methods=['get'])
    def by_role(self, request):
        """
        Filtra y lista usuarios por el rol especificado en los parámetros de consulta.
        """
        role = request.query_params.get('role')
        if role:
            usuarios = self.queryset.filter(id_rol__rol=role, activo=True)
            serializer = self.get_serializer(usuarios, many=True)
            return Response(serializer.data)
        return Response({'error': 'Rol no especificado'}, status=status.HTTP_400_BAD_REQUEST)
class ZonaViewSet(viewsets.ModelViewSet):
    """ViewSet para el modelo Zona."""
    queryset = Zona.objects.all()
    serializer_class = ZonaSerializer


class UbicacionSlotViewSet(viewsets.ModelViewSet):
    """ViewSet para el modelo UbicacionSlot."""
    queryset = UbicacionSlot.objects.all()
    serializer_class = UbicacionSlotSerializer


class BuqueViewSet(viewsets.ModelViewSet):
    """ViewSet para el modelo Buque."""
    queryset = Buque.objects.all()
    serializer_class = BuqueSerializer


class CitaRecojoViewSet(viewsets.ModelViewSet):
    """ViewSet para el modelo CitaRecojo."""
    queryset = CitaRecojo.objects.all()
    serializer_class = CitaRecojoSerializer


class ContenedorViewSet(viewsets.ModelViewSet):
    """ViewSet para el modelo Contenedor."""
    queryset = Contenedor.objects.all()
    serializer_class = ContenedorSerializer


class TicketViewSet(viewsets.ModelViewSet):
    """ViewSet para el modelo Ticket.
    
    Con acciones personalizadas para filtrado y cambio de estado.
    """
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    @action(detail=False, methods=['get'])
    def by_estado(self, request):
        """Filtra tickets por el estado especificado."""
        estado = request.query_params.get('estado')
        if estado:
            tickets = self.queryset.filter(estado=estado)
            serializer = self.get_serializer(tickets, many=True)
            return Response(serializer.data)
        return Response({'error': 'Estado no especificado'}, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=False, methods=['get'])
    def by_usuario(self, request):
        """Filtra tickets por el ID de usuario especificado."""
        usuario_id = request.query_params.get('usuario_id')
        if usuario_id:
            tickets = self.queryset.filter(id_usuario=usuario_id)
            serializer = self.get_serializer(tickets, many=True)
            return Response(serializer.data)
        return Response({'error': 'Usuario no especificado'}, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=True, methods=['patch'])
    def cambiar_estado(self, request, pk=None):  # pylint: disable=unused-argument  # pylint: disable=unused-argument
        """
        Permite cambiar el estado de un ticket.
        
        Registra la fecha de salida si el estado es 'Completado'.
        """
        ticket = self.get_object()
        nuevo_estado = request.data.get('estado')
        if nuevo_estado:
            ticket.estado = nuevo_estado
            if nuevo_estado == 'Completado':
                # C0415 Corregido: Movido a la parte superior
                ticket.fecha_hora_salida = timezone.now()
            ticket.save()
            serializer = self.get_serializer(ticket)
            return Response(serializer.data)

        return Response({'error': 'Estado no especificado'}, status=status.HTTP_400_BAD_REQUEST)


class FacturaViewSet(viewsets.ModelViewSet):
    """ViewSet para el modelo Factura."""
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer


class PagoViewSet(viewsets.ModelViewSet):
    """ViewSet para el modelo Pago."""
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer


class ReporteViewSet(viewsets.ModelViewSet):
    """ViewSet para el modelo Reporte."""
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
