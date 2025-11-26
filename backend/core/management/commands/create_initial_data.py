"""
Comando de gestiÃ³n personalizado para crear todos los datos iniciales
y de prueba necesarios para el funcionamiento del sistema ENAPU.
Incluye roles, niveles de acceso, usuarios, zonas, buques, citas, contenedores y tickets.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from core.models import (
    Rol, NivelAcceso, Usuario, Zona, UbicacionSlot,
    Buque, CitaRecojo, Contenedor, Ticket
)


class Command(BaseCommand):
    """
    Clase de comando de gestiÃ³n para la carga de datos iniciales.
    Ejecuta el proceso completo de creaciÃ³n de datos.
    """
    help = 'Crea datos iniciales para el sistema ENAPU'

    @staticmethod
    def _create_roles(style):
        """Crea los roles de usuario (ADMINISTRADOR, OPERARIO, CLIENTE)."""
        rol_admin, _ = Rol.objects.get_or_create(id=1, defaults={'rol': 'ADMINISTRADOR'})
        rol_operario, _ = Rol.objects.get_or_create(id=2, defaults={'rol': 'OPERARIO'})
        rol_cliente, _ = Rol.objects.get_or_create(id=3, defaults={'rol': 'CLIENTE'})

        print(style.SUCCESS('✔ Roles creados'))
        return rol_admin, rol_operario, rol_cliente

    @staticmethod
    def _create_levels(style):
        """Crea los niveles de acceso (Total, Operativo, BÃ¡sico)."""
        nivel_admin, _ = NivelAcceso.objects.get_or_create(id=1, defaults={'nivel': 'Total'})
        nivel_operario, _ = NivelAcceso.objects.get_or_create(id=2, defaults={'nivel': 'Operativo'})
        nivel_cliente, _ = NivelAcceso.objects.get_or_create(id=3, defaults={'nivel': 'BÃ¡sico'})

        print(style.SUCCESS('âœ“ Niveles de acceso creados'))
        return nivel_admin, nivel_operario, nivel_cliente

    @staticmethod
    def _create_users(
            style, rol_admin, rol_operario, rol_cliente,
            nivel_admin, nivel_operario, nivel_cliente
    ):
        """Crea los usuarios iniciales de prueba (Admin, Operario, Cliente)."""
        usuarios_data = [
            {
                'nombre': 'Juan Administrador',
                'email': 'admin@enapu.com',
                'password': 'admin123',
                'telefono': '999888777',
                'empresa': 'ENAPU',
                'id_rol': rol_admin,
                'id_nivel_acceso': nivel_admin
            },
            {
                'nombre': 'Carlos López',
                'email': 'operario@enapu.com',
                'password': 'operario123',
                'telefono': '999777666',
                'empresa': 'ENAPU',
                'id_rol': rol_operario,
                'id_nivel_acceso': nivel_operario
            },
            {
                'nombre': 'María García',
                'email': 'cliente@empresa.com',
                'password': 'cliente123',
                'telefono': '999666555',
                'empresa': 'Transportes García SAC',
                'id_rol': rol_cliente,
                'id_nivel_acceso': nivel_cliente
            }
        ]

        for user_data in usuarios_data:
            if not Usuario.objects.filter(email=user_data['email']).exists():
                user_data['password'] = make_password(user_data['password'])
                Usuario.objects.create(**user_data)
                print(style.SUCCESS(f"âœ“ Usuario creado: {user_data['nombre']}"))

        return Usuario.objects.filter(id_rol=rol_operario).first()

    @staticmethod
    def _create_zones_and_slots(style):
        """Crea las zonas de almacenamiento y las ubicaciones (slots)."""
        zonas_data = [
            {'nombre': 'Zona A', 'capacidad': 100},
            {'nombre': 'Zona B', 'capacidad': 150},
            {'nombre': 'Zona C', 'capacidad': 120},
        ]
        zonas = []
        for zona_data in zonas_data:
            zona, created = Zona.objects.get_or_create(
                nombre=zona_data['nombre'],
                defaults={'capacidad': zona_data['capacidad']}
            )
            zonas.append(zona)
            if created:
                print(style.SUCCESS(f"âœ“ Zona creada: {zona.nombre}"))

        slot_count = 0
        for zona in zonas:
            for fila in range(1, 6):  # 5 filas
                for columna in range(1, 11):  # 10 columnas
                    for nivel in range(1, 4):  # 3 niveles
                        if not UbicacionSlot.objects.filter(
                            id_zona=zona, fila=fila, columna=columna, nivel=nivel
                        ).exists():
                            UbicacionSlot.objects.create(
                                fila=fila,
                                columna=columna,
                                nivel=nivel,
                                estado='Disponible',
                                id_zona=zona
                            )
                            slot_count += 1

        print(style.SUCCESS(f'âœ“ {slot_count} slots creados'))
        return zonas

    @staticmethod
    def _create_buques_citas_contenedores(style, buques_data, tipos_contenedor):
        """Crea buques, citas de recojo y contenedores de prueba."""
        buques = []
        for data in buques_data:
            buque, created = Buque.objects.get_or_create(**data)
            buques.append(buque)
            if created:
                print(style.SUCCESS(f"âœ“ Buque creado: {buque.nombre}"))

        citas = []
        for i in range(10):
            fecha_inicio = timezone.now().date()
            fecha_salida = fecha_inicio + timezone.timedelta(days=7)

            cita, created = CitaRecojo.objects.get_or_create(
                fecha_inicio_horario=fecha_inicio,
                fecha_salida_horario=fecha_salida,
                defaults={'estado': 'Activa'}
            )
            citas.append(cita)
            if created:
                print(style.SUCCESS(f"âœ“ Cita creada: {cita.id}"))

        contenedores = []
        for i in range(20):
            if not Contenedor.objects.filter(id=i+1).exists():
                contenedor = Contenedor.objects.create(
                    dimensiones=f'{tipos_contenedor[i % 3]}',
                    tipo=tipos_contenedor[i % 3],
                    peso=15000.0 + (i * 500),
                    id_buque=buques[i % len(buques)],
                    id_cita_recojo=citas[i % len(citas)]
                )
                contenedores.append(contenedor)
                print(
                    style.SUCCESS(
                        f"✔ Contenedor creado: CONT-{contenedor.id:04d}"
                    )
                )

        return contenedores

    @staticmethod
    def _create_tickets(style, contenedores, usuario_operario):
        """Crea tickets de ejemplo y asigna estados a slots."""
        estados = ['Pendiente', 'Validado', 'En Cola', 'En Proceso', 'Completado']
        # Obtener slots disponibles (limitar a 20 para el ejemplo)
        slots_disponibles = list(UbicacionSlot.objects.filter(estado='Disponible')[:20])

        for i, contenedor in enumerate(contenedores[:10]):
            if not Ticket.objects.filter(id_contenedor=contenedor).exists():
                slot = slots_disponibles[i] if i < len(slots_disponibles) else slots_disponibles[0]

                ticket = Ticket.objects.create(
                    fecha_hora_entrada=timezone.now() - timezone.timedelta(hours=i),
                    estado=estados[i % len(estados)],
                    id_ubicacion=slot,
                    id_usuario=usuario_operario,
                    id_contenedor=contenedor
                )

                if ticket.estado == 'Completado':
                    ticket.fecha_hora_salida = timezone.now()
                    ticket.save()

                if ticket.estado in ['En Proceso', 'Completado']:
                    slot.estado = 'Ocupado'
                    slot.save()

                print(style.SUCCESS(f"âœ“ Ticket creado: #{ticket.id}"))


    def handle(self, *args, **kwargs):
        """
        MÃ©todo principal que coordina la creaciÃ³n de todos los datos iniciales.
        """
        # C0116 Corregido: Se aÃ±ade docstring

        # C0303, C0301 Corregidos: eliminados espacios y acortadas lÃ­neas en datos
        buques_data = [
            {'nombre': 'MSC MAYA', 'linea_naviera': 'MSC'},
            {'nombre': 'MAERSK ESSEX', 'linea_naviera': 'MAERSK'},
            {'nombre': 'EVERGREEN HARMONY', 'linea_naviera': 'EVERGREEN'},
        ]
        tipos_contenedor = ['20FT', '40FT', '40HC']

        # 1. CreaciÃ³n de Roles y Niveles
        self.stdout.write('Creando Roles y Niveles de Acceso...')
        rol_admin, rol_operario, rol_cliente = self._create_roles(self.style)
        nivel_admin, nivel_operario, nivel_cliente = self._create_levels(self.style)

        # 2. CreaciÃ³n de Usuarios
        self.stdout.write('\nCreando Usuarios principales...')
        usuario_operario = self._create_users(
            self.style, rol_admin, rol_operario, rol_cliente,
            nivel_admin, nivel_operario, nivel_cliente
        )

        # 3. CreaciÃ³n de Zonas y Slots
        self.stdout.write('\nCreando Zonas y Slots...')
        self._create_zones_and_slots(self.style)

        # 4. Creación de Buques, Citas y Contenedores
        self.stdout.write('\nCreando Buques, Citas y Contenedores...')
        contenedores = self._create_buques_citas_contenedores(
            self.style, buques_data, tipos_contenedor
        )

        # 5. Creación de Tickets
        self.stdout.write('\nCreando Tickets de ejemplo...')
        self._create_tickets(self.style, contenedores, usuario_operario)

        self.stdout.write(
            self.style.SUCCESS('\n¡Datos iniciales creados exitosamente!')
        )
        self.stdout.write('\nUsuarios creados:')
        self.stdout.write('1. Administrador - admin@enapu.com / admin123')
        self.stdout.write('2. Operario - operario@enapu.com / operario123')
        self.stdout.write('3. Cliente - cliente@empresa.com / cliente123')
