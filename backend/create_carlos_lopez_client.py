import os
import django
import sys

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Usuario, Rol, NivelAcceso
from django.contrib.auth.hashers import make_password

def create_carlos_lopez_client():
    """Crear un cliente con el nombre Carlos López"""
    
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
    
    # Verificar si ya existe
    existe = Usuario.objects.filter(email='carlos.lopez@cliente.com').exists()
    if existe:
        print("⚠️  Carlos López cliente ya existe")
        return
    
    # Crear nuevo cliente
    cliente = Usuario.objects.create(
        nombre='Carlos López',
        email='carlos.lopez@cliente.com',
        password=make_password('cliente123'),
        telefono='987654327',
        empresa='López Transport Solutions',
        id_rol=rol_cliente,
        id_nivel_acceso=nivel_basico
    )
    
    print(f"✅ Cliente Carlos López creado:")
    print(f"   Email: {cliente.email}")
    print(f"   Empresa: {cliente.empresa}")
    print(f"   Password: cliente123")
    
    return cliente

def show_all_users():
    """Mostrar todos los usuarios y sus roles"""
    
    usuarios = Usuario.objects.all()
    
    print("\n📋 TODOS LOS USUARIOS:")
    print("-" * 80)
    
    for usuario in usuarios:
        print(f"ID: {usuario.id}")
        print(f"Nombre: {usuario.nombre}")
        print(f"Email: {usuario.email}")
        print(f"Rol: {usuario.id_rol.rol}")
        print(f"Empresa: {usuario.empresa}")
        print("-" * 40)

if __name__ == '__main__':
    print("=" * 60)
    print("👤 Creando cliente Carlos López...")
    print("=" * 60)
    
    show_all_users()
    create_carlos_lopez_client()
    
    print("\n✅ Proceso completado!")