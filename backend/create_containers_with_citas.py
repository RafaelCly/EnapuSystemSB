import os
import django
import sys
import random
from datetime import datetime, timedelta

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import CitaRecojo, Usuario, Rol, Contenedor, Buque

def create_more_containers_with_citas():
    """Crear más contenedores con citas asignadas a diferentes clientes"""
    
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
    
    # Obtener buques disponibles
    buques = list(Buque.objects.all())
    if not buques:
        print("❌ No hay buques en la base de datos")
        return
    
    print(f"\n📋 Buques disponibles: {len(buques)}")
    
    # Obtener el último contenedor para continuar la numeración
    ultimo_contenedor = Contenedor.objects.order_by('-id').first()
    siguiente_num = ultimo_contenedor.id + 1 if ultimo_contenedor else 1
    
    today = datetime.now().date()
    tipos_contenedor = ['20ft', '40ft', '40ft HC']
    dimensiones_map = {
        '20ft': '20x8x8',
        '40ft': '40x8x8',
        '40ft HC': '40x8x9'
    }
    
    contenedores_creados = 0
    
    # Crear 10 contenedores más con sus citas
    for i in range(10):
        # Seleccionar cliente aleatorio
        cliente_random = random.choice(clientes)
        buque_random = random.choice(buques)
        tipo_random = random.choice(tipos_contenedor)
        
        # Generar fechas aleatorias
        dias_atras = random.randint(10, 30)
        fecha_envio = today - timedelta(days=dias_atras)
        
        dias_adelante = random.randint(3, 20)
        fecha_recojo = today + timedelta(days=dias_adelante)
        
        duracion_viaje = random.randint(8, 25)
        
        # Crear cita
        cita = CitaRecojo.objects.create(
            fecha_envio=fecha_envio,
            fecha_recojo=fecha_recojo,
            duracion_viaje_dias=duracion_viaje,
            estado='confirmada',
            id_cliente=cliente_random
        )
        
        # Crear contenedor
        contenedor = Contenedor.objects.create(
            codigo_barras=f'CONT-2024-{str(siguiente_num + i).zfill(3)}',
            numero_contenedor=f'CONT-{siguiente_num + i}',
            dimensiones=dimensiones_map[tipo_random],
            tipo=tipo_random,
            peso=random.randint(15000, 30000),
            id_buque=buque_random,
            id_cita_recojo=cita
        )
        
        print(f"\n✅ Contenedor {contenedor.codigo_barras} creado:")
        print(f"   Tipo: {tipo_random}")
        print(f"   Cliente: {cliente_random.nombre} ({cliente_random.empresa})")
        print(f"   Buque: {buque_random.nombre}")
        print(f"   Fecha Envío: {fecha_envio}")
        print(f"   Fecha Recojo: {fecha_recojo}")
        
        contenedores_creados += 1
    
    print(f"\n✅ {contenedores_creados} contenedores con citas creados exitosamente!")
    print(f"📊 Total contenedores en BD: {Contenedor.objects.count()}")
    print(f"📊 Total citas en BD: {CitaRecojo.objects.count()}")

if __name__ == '__main__':
    print("=" * 60)
    print("🔧 Creando más contenedores con citas...")
    print("=" * 60)
    create_more_containers_with_citas()
    print("\n✅ Proceso completado!")
