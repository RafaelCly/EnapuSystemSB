import os
import django
import sys

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Usuario, Ticket

def debug_user_tickets():
    """Debug de tickets por usuario"""
    
    # Buscar María García
    maria = Usuario.objects.filter(email='cliente@empresa.com').first()
    
    if maria:
        print(f"👤 Usuario encontrado:")
        print(f"   ID: {maria.id}")
        print(f"   Nombre: {maria.nombre}")
        print(f"   Email: {maria.email}")
        print(f"   Rol: {maria.id_rol.rol}")
        
        # Buscar sus tickets
        tickets = Ticket.objects.filter(id_usuario=maria.id)
        print(f"\n🎫 Tickets de María García:")
        print(f"   Total: {tickets.count()}")
        
        for ticket in tickets:
            print(f"   - ID: {ticket.id}")
            print(f"     Estado: {ticket.estado}")
            print(f"     Contenedor: {ticket.id_contenedor.codigo_barras if ticket.id_contenedor else 'Sin contenedor'}")
            print(f"     Entrada: {ticket.fecha_hora_entrada}")
            print()
    
    # También verificar Carlos López
    carlos = Usuario.objects.filter(email='carlos.lopez@cliente.com').first()
    
    if carlos:
        tickets_carlos = Ticket.objects.filter(id_usuario=carlos.id)
        print(f"👤 Carlos López:")
        print(f"   ID: {carlos.id}")
        print(f"   Tickets: {tickets_carlos.count()}")
        
        for ticket in tickets_carlos:
            print(f"   - Ticket {ticket.id}: {ticket.estado}")

if __name__ == '__main__':
    debug_user_tickets()