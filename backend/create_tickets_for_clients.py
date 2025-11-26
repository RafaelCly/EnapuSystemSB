import os
import django
import sys
import random
from datetime import datetime, timedelta

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Ticket, Usuario, Rol, Contenedor, UbicacionSlot

def create_tickets_for_clients():
    """Crear tickets para todos los clientes basados en sus contenedores"""
    
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
    
    # Obtener ubicaciones disponibles
    ubicaciones = list(UbicacionSlot.objects.all())
    if not ubicaciones:
        print("❌ No hay ubicaciones disponibles")
        return
    
    # Estados posibles para tickets
    estados_ticket = ['en_proceso', 'completado', 'pendiente', 'en_espera']
    
    tickets_creados = 0
    
    for cliente in clientes:
        # Obtener contenedores del cliente a través de sus citas
        contenedores_cliente = Contenedor.objects.filter(
            id_cita_recojo__id_cliente=cliente
        )
        
        print(f"\n👤 Cliente: {cliente.nombre} ({cliente.empresa})")
        print(f"   Contenedores asociados: {contenedores_cliente.count()}")
        
        if contenedores_cliente.count() == 0:
            continue
        
        # Crear 2-4 tickets por cliente
        num_tickets = min(random.randint(2, 4), contenedores_cliente.count())
        contenedores_seleccionados = random.sample(list(contenedores_cliente), num_tickets)
        
        for contenedor in contenedores_seleccionados:
            # Verificar si ya existe un ticket para este contenedor
            ticket_existente = Ticket.objects.filter(
                id_contenedor=contenedor,
                id_usuario=cliente
            ).first()
            
            if ticket_existente:
                print(f"   ⚠️  Ya existe ticket para contenedor {contenedor.codigo_barras}")
                continue
            
            # Generar fechas aleatorias
            dias_atras = random.randint(1, 30)
            fecha_entrada = datetime.now() - timedelta(days=dias_atras)
            
            # Algunos tickets ya completados, otros en proceso
            estado = random.choice(estados_ticket)
            fecha_salida = None
            
            if estado == 'completado':
                # Fecha de salida 1-5 días después de entrada
                fecha_salida = fecha_entrada + timedelta(days=random.randint(1, 5))
            
            # Seleccionar ubicación aleatoria
            ubicacion = random.choice(ubicaciones)
            
            # Crear el ticket
            ticket = Ticket.objects.create(
                fecha_hora_entrada=fecha_entrada,
                fecha_hora_salida=fecha_salida,
                estado=estado,
                id_ubicacion=ubicacion,
                id_usuario=cliente,
                id_contenedor=contenedor,
                fecha_modificacion=datetime.now()
            )
            
            print(f"   ✅ Ticket {ticket.id} creado:")
            print(f"      Contenedor: {contenedor.codigo_barras}")
            print(f"      Estado: {estado}")
            print(f"      Entrada: {fecha_entrada.strftime('%Y-%m-%d %H:%M')}")
            if fecha_salida:
                print(f"      Salida: {fecha_salida.strftime('%Y-%m-%d %H:%M')}")
            print(f"      Ubicación: {ubicacion}")
            
            tickets_creados += 1
    
    print(f"\n✅ {tickets_creados} tickets creados para clientes!")
    print(f"📊 Total tickets en BD: {Ticket.objects.count()}")

if __name__ == '__main__':
    print("=" * 60)
    print("🎫 Creando tickets para clientes...")
    print("=" * 60)
    create_tickets_for_clients()
    print("\n✅ Proceso completado!")