#!/usr/bin/env python
"""Script para verificar datos en la base de datos"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Usuario, Ticket, Zona, Contenedor, Buque

print("=" * 60)
print("VERIFICACIÓN DE DATOS EN LA BASE DE DATOS")
print("=" * 60)

# Usuarios
usuarios = Usuario.objects.all()
print(f"\n✓ Total Usuarios: {usuarios.count()}")
for u in usuarios[:10]:
    print(f"  - {u.email}")

# Tickets
tickets = Ticket.objects.all()
print(f"\n✓ Total Tickets: {tickets.count()}")

# Zonas
zonas = Zona.objects.all()
print(f"\n✓ Total Zonas: {zonas.count()}")

# Contenedores
contenedores = Contenedor.objects.all()
print(f"\n✓ Total Contenedores: {contenedores.count()}")

# Buques
buques = Buque.objects.all()
print(f"\n✓ Total Buques: {buques.count()}")

print("\n" + "=" * 60)
print("VERIFICACIÓN COMPLETADA")
print("=" * 60)
