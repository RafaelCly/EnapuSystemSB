import os
import django
from datetime import datetime, timedelta
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import CitaRecojo, Usuario, Contenedor

# Obtener el cliente de la BD (debe existir un usuario con rol CLIENTE)
try:
    cliente = Usuario.objects.filter(id_rol__rol='CLIENTE').first()
    if not cliente:
        print("❌ No hay usuarios con rol CLIENTE en la base de datos")
        exit(1)
    print(f"✓ Cliente encontrado: {cliente.nombre} (ID: {cliente.id})")
except Exception as e:
    print(f"❌ Error buscando cliente: {e}")
    exit(1)

# Actualizar citas existentes
citas = CitaRecojo.objects.all()
print(f"\nActualizando {citas.count()} citas...")

for i, cita in enumerate(citas, start=1):
    # Generar fechas realistas (buque salió hace 15-30 días, llega en 5-10 días)
    dias_desde_envio = random.randint(15, 30)
    dias_hasta_recojo = random.randint(5, 10)
    
    fecha_envio = datetime.now() - timedelta(days=dias_desde_envio)
    fecha_recojo = datetime.now() + timedelta(days=dias_hasta_recojo)
    duracion = dias_desde_envio + dias_hasta_recojo
    
    cita.id_cliente = cliente
    cita.fecha_envio = fecha_envio.date()
    cita.fecha_recojo = fecha_recojo.date()
    cita.duracion_viaje_dias = duracion
    cita.estado = 'confirmada'
    cita.save()
    
    print(f"✓ Cita {cita.id}: Cliente={cliente.nombre}, Envío={fecha_envio.strftime('%Y-%m-%d')}, Recojo={fecha_recojo.strftime('%Y-%m-%d')}, Duración={duracion} días")

print(f"\n✅ {citas.count()} citas actualizadas con datos completos!")
