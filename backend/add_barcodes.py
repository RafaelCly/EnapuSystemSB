import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Contenedor

# Obtener todos los contenedores
contenedores = Contenedor.objects.all()

print(f"Actualizando {contenedores.count()} contenedores...")

for i, contenedor in enumerate(contenedores, start=1):
    if not contenedor.codigo_barras:
        contenedor.codigo_barras = f"CONT-2024-{str(i).zfill(3)}"
        contenedor.numero_contenedor = f"ABCD{str(i).zfill(7)}"
        contenedor.dimensiones = "20x8x8" if contenedor.tipo in ["20FT", "20ft"] else "40x8x9"
        contenedor.save()
        print(f"✓ Contenedor {contenedor.id}: {contenedor.codigo_barras}")

print(f"\n✅ Completado! {contenedores.count()} contenedores actualizados.")
