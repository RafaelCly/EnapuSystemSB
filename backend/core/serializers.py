"""
Serializadores de Django REST Framework para la aplicación 'core'.

Definen la lógica de serialización y deserialización para convertir 
los modelos de Django a formatos como JSON, y viceversa, para la API.
"""
from rest_framework import serializers
# C0415 Corregido: La importación se mueve al inicio del archivo
from django.contrib.auth.hashers import make_password
from .models import (
    Rol, NivelAcceso, Usuario, Zona, UbicacionSlot, Buque,
    CitaRecojo, Contenedor, Ticket, Factura, Pago, Reporte
)


class RolSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Rol."""
    class Meta:
        """Clase Meta para RolSerializer."""
        model = Rol
        fields = '__all__'


class NivelAccesoSerializer(serializers.ModelSerializer):
    """Serializador para el modelo NivelAcceso."""
    class Meta:
        """Clase Meta para NivelAccesoSerializer."""
        model = NivelAcceso
        fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Usuario, incluye el hash de la contraseña y detalles de roles."""
    rol_nombre = serializers.CharField(source='id_rol.rol', read_only=True)
    nivel_nombre = serializers.CharField(source='id_nivel_acceso.nivel', read_only=True)
    class Meta:
        """Clase Meta para UsuarioSerializer."""
        model = Usuario
        # C0301 Corregido: Se divide la lista de campos en múltiples líneas
        fields = [
            'id', 'nombre', 'email', 'password', 'telefono', 'empresa',
            'id_rol', 'rol_nombre', 'id_nivel_acceso', 'nivel_nombre',
            'fecha_modificacion', 'fecha_creacion', 'activo'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        """Crea un nuevo usuario asegurando que la contraseña se guarde hasheada."""
        password = validated_data.pop('password', None)
        usuario = Usuario(**validated_data)
        if password:
            usuario.password = make_password(password)
        usuario.save()
        return usuario
    def update(self, instance, validated_data):
        """Actualiza un usuario existente, hasheando la contraseña si se proporciona."""
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = make_password(password)
        instance.save()
        return instance


class ZonaSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Zona."""
    class Meta:
        """Clase Meta para ZonaSerializer."""
        model = Zona
        fields = '__all__'


class UbicacionSlotSerializer(serializers.ModelSerializer):
    """Serializador para el modelo UbicacionSlot."""
    class Meta:
        """Clase Meta para UbicacionSlotSerializer."""
        model = UbicacionSlot
        fields = '__all__'


class BuqueSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Buque."""
    class Meta:
        """Clase Meta para BuqueSerializer."""
        model = Buque
        fields = '__all__'


class CitaRecojoSerializer(serializers.ModelSerializer):
    """Serializador para el modelo CitaRecojo, incluyendo información del cliente relacionada."""
    cliente_nombre = serializers.CharField(source='id_cliente.nombre', read_only=True)
    cliente_email = serializers.CharField(source='id_cliente.email', read_only=True)
    class Meta:
        """Clase Meta para CitaRecojoSerializer."""
        model = CitaRecojo
        # C0301 Corregido: Se divide la lista de campos en múltiples líneas
        fields = [
            'id', 'fecha_envio', 'fecha_recojo', 'duracion_viaje_dias', 'estado',
                  'id_cliente', 'cliente_nombre', 'cliente_email', 'fecha_creacion',
                  'fecha_inicio_horario', 'fecha_salida_horario']


class ContenedorSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Contenedor, incluyendo información de la cita y el buque."""
    cita_info = serializers.SerializerMethodField()
    buque_nombre = serializers.CharField(source='id_buque.nombre', read_only=True)
    class Meta:
        """Clase Meta para ContenedorSerializer."""
        model = Contenedor
        # C0301 Corregido: Se divide la lista de campos en múltiples líneas
        fields = [
            'id', 'codigo_barras', 'numero_contenedor', 'dimensiones',
            'tipo', 'peso', 'id_buque', 'buque_nombre', 'id_cita_recojo',
            'cita_info'
        ]

    def get_cita_info(self, obj):
        """Devuelve un objeto con información resumida de la CitaRecojo asociada."""
        if obj.id_cita_recojo:
            cliente_nombre = None
            if obj.id_cita_recojo.id_cliente:
                cliente_nombre = obj.id_cita_recojo.id_cliente.nombre
            return {
                'fecha_envio': obj.id_cita_recojo.fecha_envio,
                'fecha_recojo': obj.id_cita_recojo.fecha_recojo,
                'cliente': cliente_nombre,
                'estado': obj.id_cita_recojo.estado
            }
        return None


class TicketSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Ticket.
    
    Con información anidada de usuario, contenedor y ubicación.
    """
    usuario_nombre = serializers.CharField(source='id_usuario.nombre', read_only=True)
    contenedor_info = serializers.SerializerMethodField()
    ubicacion_info = serializers.SerializerMethodField()
    class Meta:
        """Clase Meta para TicketSerializer."""
        model = Ticket
        # C0301 Corregido: Se divide la lista de campos en múltiples líneas
        fields = [
            'id', 'fecha_hora_entrada', 'fecha_hora_salida', 'estado',
                  'id_ubicacion', 'ubicacion_info', 'id_usuario', 'usuario_nombre', 
            'id_ubicacion', 'ubicacion_info', 'id_usuario', 'usuario_nombre',
            'id_contenedor', 'contenedor_info', 'fecha_modificacion'
        ]
    def get_contenedor_info(self, obj):
        """Devuelve un objeto con información resumida del Contenedor asociado."""
        if obj.id_contenedor:
            return {
                'codigo_barras': obj.id_contenedor.codigo_barras,
                'numero_contenedor': obj.id_contenedor.numero_contenedor,
                'tipo': obj.id_contenedor.tipo,
                'dimensiones': obj.id_contenedor.dimensiones,
                'peso': obj.id_contenedor.peso
            }
        return None
    def get_ubicacion_info(self, obj):
        """Devuelve un objeto con información detallada de la UbicacionSlot asociada."""
        if obj.id_ubicacion:
            zona_nombre = None
            zona_id = None
            if obj.id_ubicacion.id_zona:
                zona_nombre = obj.id_ubicacion.id_zona.nombre
                zona_id = obj.id_ubicacion.id_zona.id
            return {
                'fila': obj.id_ubicacion.fila,
                'columna': obj.id_ubicacion.columna,
                'nivel': obj.id_ubicacion.nivel,
                'zona_nombre': zona_nombre,
                'zona_id': zona_id
            }
        return None


class FacturaSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Factura."""
    class Meta:
        """Clase Meta para FacturaSerializer."""
        model = Factura
        fields = '__all__'


class PagoSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Pago."""
    class Meta:
        """Clase Meta para PagoSerializer."""
        model = Pago
        fields = '__all__'


class ReporteSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Reporte."""
    class Meta:
        """Clase Meta para ReporteSerializer."""
        model = Reporte
        fields = '__all__'
