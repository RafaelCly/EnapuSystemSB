import os
import django
import sys
import random
from datetime import datetime, timedelta

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import CitaRecojo, Usuario, Rol

def update_citas_with_random_clients():
    """Actualizar las citas existentes con clientes aleatorios"""
    
    # Obtener todos los clientes
    rol_cliente = Rol.objects.filter(rol='CLIENTE').first()
    if not rol_cliente:
        print("❌ No se encontró el rol CLIENTE")
        return
    
    clientes = list(Usuario.objects.filter(id_rol=rol_cliente))
    
    if not clientes:
        print("❌ No hay clientes en la base de datos")
        return
    
    print(f"📋 Clientes disponibles: {len(clientes)}")
    for cliente in clientes:
        print(f"  - {cliente.nombre} ({cliente.empresa})")
    
    # Obtener todas las citas
    citas = CitaRecojo.objects.all()
    
    if not citas:
        print("❌ No hay citas en la base de datos")
        return
    
    print(f"\n📋 Actualizando {citas.count()} citas...")
    
    today = datetime.now().date()
    
    for cita in citas:
        # Seleccionar cliente aleatorio
        cliente_random = random.choice(clientes)
        
        # Generar fechas aleatorias
        dias_atras = random.randint(15, 30)
        fecha_envio = today - timedelta(days=dias_atras)
        
        dias_adelante = random.randint(5, 15)
        fecha_recojo = today + timedelta(days=dias_adelante)
        
        duracion_viaje = random.randint(10, 25)
        
        # Actualizar la cita
        cita.id_cliente = cliente_random
        cita.fecha_envio = fecha_envio
        cita.fecha_recojo = fecha_recojo
        cita.duracion_viaje_dias = duracion_viaje
        cita.save()
        
        print(f"✅ Cita ID {cita.id} actualizada:")
        print(f"   Cliente: {cliente_random.nombre} ({cliente_random.empresa})")
        print(f"   Fecha Envío: {fecha_envio}")
        print(f"   Fecha Recojo: {fecha_recojo}")
        print(f"   Duración: {duracion_viaje} días")
        print()
    
    print(f"✅ {citas.count()} citas actualizadas con clientes aleatorios!")

if __name__ == '__main__':
    print("=" * 60)
    print("🔧 Actualizando citas con clientes aleatorios...")
    print("=" * 60)
    update_citas_with_random_clients()
    print("\n✅ Proceso completado!")
