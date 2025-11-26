import os
import django
import sys

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Usuario, Rol, NivelAcceso
from django.contrib.auth.hashers import make_password

def add_clients():
    """Agregar 5-6 clientes nuevos a la base de datos"""
   
    # Obtener rol CLIENTE
    rol_cliente = Rol.objects.filter(rol='CLIENTE').first()
    if not rol_cliente:
        print("❌ No se encontró el rol CLIENTE")
        return
    
    # Obtener nivel de acceso básico
    nivel_basico = NivelAcceso.objects.filter(nivel='Básico').first()
    if not nivel_basico:
        print("❌ No se encontró el nivel de acceso Básico")
        return
    
    # Lista de nuevos clientes
    nuevos_clientes = [
        {
            'nombre': 'Carlos Rodríguez',
            'email': 'carlos.rodriguez@transportes.com',
            'password': 'cliente123',
            'telefono': '987654321',
            'empresa': 'Transportes Rodríguez S.A.'
        },
        {
            'nombre': 'Ana Martínez',
            'email': 'ana.martinez@logistics.com',
            'password': 'cliente123',
            'telefono': '987654322',
            'empresa': 'Logistics Express'
        },
        {
            'nombre': 'Roberto Silva',
            'email': 'roberto.silva@maritime.com',
            'password': 'cliente123',
            'telefono': '987654323',
            'empresa': 'Maritime Solutions'
        },
        {
            'nombre': 'Patricia Gómez',
            'email': 'patricia.gomez@shipping.com',
            'password': 'cliente123',
            'telefono': '987654324',
            'empresa': 'Global Shipping Inc.'
        },
        {
            'nombre': 'Luis Torres',
            'email': 'luis.torres@cargo.com',
            'password': 'cliente123',
            'telefono': '987654325',
            'empresa': 'Cargo Masters'
        },
        {
            'nombre': 'Carmen Vega',
            'email': 'carmen.vega@freight.com',
            'password': 'cliente123',
            'telefono': '987654326',
            'empresa': 'International Freight Services'
        }
    ]
    
    clientes_creados = []
    
    for cliente_data in nuevos_clientes:
        # Verificar si ya existe
        existe = Usuario.objects.filter(email=cliente_data['email']).exists()
        if existe:
            print(f"⚠️  Cliente {cliente_data['nombre']} ya existe, omitiendo...")
            continue
        
        # Crear nuevo cliente
        cliente = Usuario.objects.create(
            nombre=cliente_data['nombre'],
            email=cliente_data['email'],
            password=make_password(cliente_data['password']),
            telefono=cliente_data['telefono'],
            empresa=cliente_data['empresa'],
            id_rol=rol_cliente,
            id_nivel_acceso=nivel_basico
        )
        
        clientes_creados.append(cliente)
        print(f"✅ Cliente creado: {cliente.nombre} ({cliente.email})")
    
    print(f"\n📊 Total de clientes creados: {len(clientes_creados)}")
    print(f"📊 Total de clientes en BD: {Usuario.objects.filter(id_rol=rol_cliente).count()}")
    
    return clientes_creados

if __name__ == '__main__':
    print("=" * 60)
    print("🔧 Agregando nuevos clientes a la base de datos...")
    print("=" * 60)
    add_clients()
    print("\n✅ Proceso completado!")
