import os
import django
import sys
import random
from datetime import datetime, timedelta

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import CitaRecojo, Usuario, Contenedor, Buque, Ticket, UbicacionSlot

def create_data_for_carlos_lopez():
    """Crear datos completos para Carlos López cliente"""
    
    # Buscar el cliente Carlos López
    carlos_cliente = Usuario.objects.filter(
        email='carlos.lopez@cliente.com',
        id_rol__rol='CLIENTE'
    ).first()
    
    if not carlos_cliente:
        print("❌ No se encontró el cliente Carlos López")
        return
    
    print(f"✅ Cliente encontrado: {carlos_cliente.nombre} ({carlos_cliente.empresa})")
    
    # Obtener buques disponibles
    buques = list(Buque.objects.all())
    if not buques:
        print("❌ No hay buques en la base de datos")
        return
    
    # Obtener ubicaciones disponibles
    ubicaciones = list(UbicacionSlot.objects.all())
    if not ubicaciones:
        print("❌ No hay ubicaciones disponibles")
        return
    
    today = datetime.now().date()
    tipos_contenedor = ['20ft', '40ft', '40ft HC']
    dimensiones_map = {
        '20ft': '20x8x8',
        '40ft': '40x8x8',
        '40ft HC': '40x8x9'
    }
    
    # Obtener el último contenedor para continuar la numeración
    ultimo_contenedor = Contenedor.objects.order_by('-id').first()
    siguiente_num = ultimo_contenedor.id + 1 if ultimo_contenedor else 1
    
    print(f"\n🚢 Creando 5 contenedores con citas para Carlos López...")
    
    contenedores_creados = []
    
    for i in range(5):
        buque_random = random.choice(buques)
        tipo_random = random.choice(tipos_contenedor)
        
        # Generar fechas aleatorias
        dias_atras = random.randint(10, 25)
        fecha_envio = today - timedelta(days=dias_atras)
        
        dias_adelante = random.randint(3, 15)
        fecha_recojo = today + timedelta(days=dias_adelante)
        
        duracion_viaje = random.randint(8, 20)
        
        # Crear cita
        cita = CitaRecojo.objects.create(
            fecha_envio=fecha_envio,
            fecha_recojo=fecha_recojo,
            duracion_viaje_dias=duracion_viaje,
            estado='confirmada',
            id_cliente=carlos_cliente
        )
        
        # Crear contenedor
        contenedor = Contenedor.objects.create(
            codigo_barras=f'CL-2024-{str(siguiente_num + i).zfill(3)}',
            numero_contenedor=f'CARLOS-{siguiente_num + i}',
            dimensiones=dimensiones_map[tipo_random],
            tipo=tipo_random,
            peso=random.randint(15000, 30000),
            id_buque=buque_random,
            id_cita_recojo=cita
        )
        
        contenedores_creados.append(contenedor)
        
        print(f"   ✅ Contenedor {contenedor.codigo_barras}:")
        print(f"      Tipo: {tipo_random}")
        print(f"      Buque: {buque_random.nombre}")
        print(f"      Fecha Envío: {fecha_envio}")
        print(f"      Fecha Recojo: {fecha_recojo}")
    
    print(f"\n🎫 Creando tickets para Carlos López...")
    
    # Estados posibles para tickets
    estados_ticket = ['en_proceso', 'completado', 'pendiente', 'en_espera']
    
    tickets_creados = 0
    
    for contenedor in contenedores_creados:
        # Generar fechas aleatorias para el ticket
        dias_atras = random.randint(1, 20)
        fecha_entrada = datetime.now() - timedelta(days=dias_atras)
        
        # Algunos tickets ya completados, otros en proceso
        estado = random.choice(estados_ticket)
        fecha_salida = None
        
        if estado == 'completado':
            # Fecha de salida 1-3 días después de entrada
            fecha_salida = fecha_entrada + timedelta(days=random.randint(1, 3))
        
        # Seleccionar ubicación aleatoria
        ubicacion = random.choice(ubicaciones)
        
        # Crear el ticket
        ticket = Ticket.objects.create(
            fecha_hora_entrada=fecha_entrada,
            fecha_hora_salida=fecha_salida,
            estado=estado,
            id_ubicacion=ubicacion,
            id_usuario=carlos_cliente,
            id_contenedor=contenedor,
            fecha_modificacion=datetime.now()
        )
        
        print(f"   ✅ Ticket {ticket.id}:")
        print(f"      Contenedor: {contenedor.codigo_barras}")
        print(f"      Estado: {estado}")
        print(f"      Entrada: {fecha_entrada.strftime('%Y-%m-%d %H:%M')}")
        if fecha_salida:
            print(f"      Salida: {fecha_salida.strftime('%Y-%m-%d %H:%M')}")
        
        tickets_creados += 1
    
    print(f"\n✅ Datos creados para Carlos López:")
    print(f"   📦 {len(contenedores_creados)} contenedores")
    print(f"   📅 {len(contenedores_creados)} citas")
    print(f"   🎫 {tickets_creados} tickets")
    print(f"\n🔑 Credenciales para prueba:")
    print(f"   Email: carlos.lopez@cliente.com")
    print(f"   Password: cliente123")

if __name__ == '__main__':
    print("=" * 60)
    print("📊 Creando datos para Carlos López...")
    print("=" * 60)
    create_data_for_carlos_lopez()
    print("\n✅ Proceso completado!")