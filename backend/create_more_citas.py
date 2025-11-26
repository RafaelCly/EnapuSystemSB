import os
import django
import sys
import random
from datetime import datetime, timedelta

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import CitaRecojo, Usuario, Rol, Contenedor

def create_more_citas():
    """Crear más citas para contenedores sin cita asignada"""
    
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
    
    # Obtener contenedores sin cita
    contenedores_sin_cita = Contenedor.objects.filter(id_cita_recojo__isnull=True)
    
    print(f"📋 Contenedores sin cita: {contenedores_sin_cita.count()}")
    
    if not contenedores_sin_cita:
        print("✅ Todos los contenedores ya tienen cita asignada")
        return
    
    today = datetime.now().date()
    citas_creadas = 0
    
    # Crear citas para los primeros 10 contenedores sin cita
    for contenedor in contenedores_sin_cita[:10]:
        # Seleccionar cliente aleatorio
        cliente_random = random.choice(clientes)
        
        # Generar fechas aleatorias
        dias_atras = random.randint(15, 30)
        fecha_envio = today - timedelta(days=dias_atras)
        
        dias_adelante = random.randint(5, 15)
        fecha_recojo = today + timedelta(days=dias_adelante)
        
        duracion_viaje = random.randint(10, 25)
        
        # Crear nueva cita
        cita = CitaRecojo.objects.create(
            fecha_envio=fecha_envio,
            fecha_recojo=fecha_recojo,
            duracion_viaje_dias=duracion_viaje,
            estado='confirmada',
            id_cliente=cliente_random
        )
        
        # Asignar cita al contenedor
        contenedor.id_cita_recojo = cita
        contenedor.save()
        
        print(f"✅ Cita ID {cita.id} creada para contenedor {contenedor.codigo_barras}:")
        print(f"   Cliente: {cliente_random.nombre} ({cliente_random.empresa})")
        print(f"   Fecha Envío: {fecha_envio}")
        print(f"   Fecha Recojo: {fecha_recojo}")
        print()
        
        citas_creadas += 1
    
    print(f"✅ {citas_creadas} citas creadas exitosamente!")

if __name__ == '__main__':
    print("=" * 60)
    print("🔧 Creando más citas con clientes aleatorios...")
    print("=" * 60)
    create_more_citas()
    print("\n✅ Proceso completado!")
