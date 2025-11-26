from core.models import Usuario, Rol, NivelAcceso
from django.contrib.auth.hashers import make_password

DEFAULT_CLIENTS = [
    {"nombre": "Carlos Rodríguez", "email": "carlos.rodriguez@transportes.com",
     "password": "cliente123", "telefono": "987654321", "empresa": "Transportes Rodríguez S.A."},
    {"nombre": "Ana Martínez", "email": "ana.martinez@logistics.com",
     "password": "cliente123", "telefono": "987654322", "empresa": "Logistics Express"},
    {"nombre": "Roberto Silva", "email": "roberto.silva@maritime.com",
     "password": "cliente123", "telefono": "987654323", "empresa": "Maritime Solutions"},
    {"nombre": "Patricia Gómez", "email": "patricia.gomez@shipping.com",
     "password": "cliente123", "telefono": "987654324", "empresa": "Global Shipping Inc."},
    {"nombre": "Luis Torres", "email": "luis.torres@cargo.com",
     "password": "cliente123", "telefono": "987654325", "empresa": "Cargo Masters"},
    {"nombre": "Carmen Vega", "email": "carmen.vega@freight.com",
     "password": "cliente123", "telefono": "987654326", "empresa": "International Freight Services"}
]


def get_roles():
    """Obtener rol y nivel necesarios para crear un cliente."""
    rol = Rol.objects.filter(rol="CLIENTE").first()
    nivel = NivelAcceso.objects.filter(nivel="Básico").first()
    return rol, nivel


def create_client(data, rol, nivel):
    """Crear un cliente individual si no existe."""
    if Usuario.objects.filter(email=data["email"]).exists():
        return None

    return Usuario.objects.create(
        nombre=data["nombre"],
        email=data["email"],
        password=make_password(data["password"]),
        telefono=data["telefono"],
        empresa=data["empresa"],
        id_rol=rol,
        id_nivel_acceso=nivel
    )


def create_default_clients():
    """Crear clientes predeterminados sin enviar prints (ideal para tests)."""
    rol, nivel = get_roles()
    if not rol or not nivel:
        return []

    creados = []
    for data in DEFAULT_CLIENTS:
        cliente = create_client(data, rol, nivel)
        if cliente:
            creados.append(cliente)

    return creados

