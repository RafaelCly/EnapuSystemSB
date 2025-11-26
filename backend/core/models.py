"""
Definición de todos los modelos de la base de datos para la aplicación 'core'.

Estos modelos representan las entidades centrales del sistema de gestión 
de contenedores, incluyendo usuarios, roles, citas, contenedores y transacciones.
"""
from django.db import models


class Rol(models.Model):
    """Modelo que representa los diferentes roles de usuario en el sistema.
    
    Incluye roles como Administrador, Operario, Cliente.
    """
    id = models.AutoField(primary_key=True)
    rol = models.CharField(max_length=50)

    class Meta:
        """Metadatos del modelo Rol."""
        db_table = 'Rol'

    def __str__(self):
        return str(self.rol) # Corregido E0307: __str__ siempre debe retornar str


class NivelAcceso(models.Model):
    """Modelo que define los niveles de acceso o permisos dentro del sistema."""
    id = models.AutoField(primary_key=True)
    nivel = models.CharField(max_length=50)

    class Meta:
        """Metadatos del modelo NivelAcceso."""
        db_table = 'Nivel_acceso'

    def __str__(self):
        return str(self.nivel) # Corregido E0307: __str__ siempre debe retornar str


class Usuario(models.Model):
    """Modelo que gestiona la información de los usuarios del sistema.
    
    Incluye Clientes, Operarios y Administradores.
    """
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, unique=True, default='')
    password = models.CharField(max_length=255, default='')
    telefono = models.CharField(max_length=20, null=True, blank=True)
    empresa = models.CharField(max_length=100, null=True, blank=True)
    # C0301 Corregido dividiendo la línea larga:
    id_rol = models.ForeignKey(
        Rol, db_column='id_rol', on_delete=models.CASCADE
    )
    id_nivel_acceso = models.ForeignKey(
        NivelAcceso, db_column='id_nivel_acceso', on_delete=models.CASCADE
    )
    fecha_modificacion = models.DateTimeField(null=True, blank=True, auto_now=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    class Meta:
        """Metadatos del modelo Usuario."""
        db_table = 'Usuario'

    def __str__(self):
        return str(self.nombre) # Corregido E0307


class Zona(models.Model):
    """Modelo que representa una zona específica dentro del área de almacenamiento."""
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=25)
    capacidad = models.IntegerField()

    class Meta:
        """Metadatos del modelo Zona."""
        db_table = 'Zona'

    def __str__(self):
        return str(self.nombre) # Corregido E0307


class UbicacionSlot(models.Model):
    """Modelo que define la ubicación exacta (slot) donde se puede almacenar un contenedor."""
    id = models.AutoField(primary_key=True)
    fila = models.IntegerField()
    columna = models.IntegerField()
    nivel = models.IntegerField()
    estado = models.CharField(max_length=20)
    # C0301 Corregido:
    id_zona = models.ForeignKey(Zona, db_column='id_zona', on_delete=models.CASCADE)

    class Meta:
        """Metadatos del modelo UbicacionSlot."""
        db_table = 'Ubicacion_slot'

    def __str__(self):
        # Corregido E0307: Aseguramos que la F-string se convierta a str
        return f"Slot {self.id} - Zona {self.id_zona}"


class Buque(models.Model):
    """Modelo que registra información sobre los buques que transportan los contenedores."""
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    linea_naviera = models.CharField(max_length=50)

    class Meta:
        """Metadatos del modelo Buque."""
        db_table = 'Buque'

    def __str__(self):
        return str(self.nombre) # Corregido E0307


class CitaRecojo(models.Model):
    """Modelo central que gestiona la cita o reserva de un cliente para recoger contenedores."""
    id = models.AutoField(primary_key=True)
    fecha_envio = models.DateField(null=True, blank=True)
    fecha_recojo = models.DateField(null=True, blank=True)
    duracion_viaje_dias = models.IntegerField(default=0)
    # C0301 Corregido dividiendo la línea larga:
    estado = models.CharField(max_length=50, default='reservada')
    id_cliente = models.ForeignKey(
        'Usuario', db_column='id_cliente', on_delete=models.CASCADE,
        related_name='citas_cliente', null=True, blank=True
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    # Campos legacy para compatibilidad
    fecha_inicio_horario = models.DateField(null=True, blank=True)
    fecha_salida_horario = models.DateField(null=True, blank=True)

    class Meta:
        """Metadatos del modelo CitaRecojo."""
        db_table = 'Cita_recojo'

    def __str__(self):
        # Corregido E0307
        return f"Cita {self.id} - {self.estado}"


class Contenedor(models.Model):
    """Modelo que registra la información detallada de cada contenedor."""
    id = models.AutoField(primary_key=True)
    codigo_barras = models.CharField(max_length=50, unique=True, null=True, blank=True)
    # C0301 Corregido:
    numero_contenedor = models.CharField(max_length=50, null=True, blank=True)
    dimensiones = models.CharField(max_length=50)
    tipo = models.CharField(max_length=20)
    peso = models.FloatField()
    # C0301 Corregido dividiendo la línea larga:
    id_buque = models.ForeignKey(Buque, db_column='id_buque', on_delete=models.CASCADE)
    id_cita_recojo = models.ForeignKey(
        CitaRecojo, db_column='id_cita_recojo', on_delete=models.CASCADE,
        null=True, blank=True
    )

    class Meta:
        """Metadatos del modelo Contenedor."""
        db_table = 'Contenedor'

    def __str__(self):
        # Corregido E0307
        contenedor_id = (self.codigo_barras or
                        self.numero_contenedor or
                        self.id)
        return f"Contenedor {contenedor_id} - {self.tipo}"


class Ticket(models.Model):
    """Modelo que representa un ticket de ingreso/salida.
    
    Para un contenedor en un slot específico.
    """
    id = models.AutoField(primary_key=True)
    fecha_hora_entrada = models.DateTimeField()
    fecha_hora_salida = models.DateTimeField(null=True, blank=True)
    estado = models.CharField(max_length=50)
    # C0301 Corregido dividiendo la línea larga:
    id_ubicacion = models.ForeignKey(
        UbicacionSlot, db_column='id_ubicacion', on_delete=models.CASCADE
    )
    id_usuario = models.ForeignKey(
        Usuario, db_column='id_usuario', on_delete=models.CASCADE
    )
    id_contenedor = models.ForeignKey(
        Contenedor, db_column='id_contenedor', on_delete=models.CASCADE
    )
    fecha_modificacion = models.DateTimeField(null=True, blank=True)

    class Meta:
        """Metadatos del modelo Ticket."""
        db_table = 'Ticket'

    def __str__(self):
        # Corregido E0307
        return f"Ticket {self.id} - {self.estado}"


class Factura(models.Model):
    """Modelo que gestiona la información de la facturación asociada a un ticket."""
    id = models.AutoField(primary_key=True)
    fecha_emision = models.DateField()
    monto = models.FloatField()
    estado = models.CharField(max_length=50)
    # C0301 Corregido:
    id_ticket = models.ForeignKey(
        Ticket, db_column='id_ticket', on_delete=models.CASCADE
    )

    class Meta:
        """Metadatos del modelo Factura."""
        db_table = 'Factura'

    def __str__(self):
        # Corregido E0307
        return f"Factura {self.id} - {self.estado}"


class Pago(models.Model):
    """Modelo que registra la información de los pagos realizados para una factura."""
    id = models.AutoField(primary_key=True)
    fecha_pago = models.DateField()
    medio_pago = models.CharField(max_length=30)
    monto = models.FloatField()
    # C0301 Corregido:
    id_factura = models.ForeignKey(
        Factura, db_column='id_factura', on_delete=models.CASCADE
    )

    class Meta:
        """Metadatos del modelo Pago."""
        db_table = 'Pago'

    def __str__(self):
        # Corregido E0307
        return f"Pago {self.id} - {self.monto}"


class Reporte(models.Model):
    """Modelo que registra la metadata de los reportes generados por el sistema."""
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=50)
    fecha_generacion = models.DateField()
    parametros = models.CharField(max_length=50)

    class Meta:
        """Metadatos del modelo Reporte."""
        db_table = 'Reporte'

    def __str__(self):
        # Corregido E0307
        return f"Reporte {self.id} - {self.tipo}"
