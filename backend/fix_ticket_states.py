import os
import django
import sys

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Ticket

def fix_ticket_states():
    """Corregir estados de tickets en minúsculas"""
    
    # Obtener tickets con estados en minúsculas
    tickets_pendientes = Ticket.objects.filter(estado='pendiente')
    
    print(f"📋 Tickets con estado 'pendiente' (minúscula): {tickets_pendientes.count()}")
    
    # Actualizar a "Pendiente" con mayúscula
    for ticket in tickets_pendientes:
        ticket.estado = 'Pendiente'
        ticket.save()
        print(f"✅ Ticket #{ticket.id} actualizado a 'Pendiente'")
    
    print(f"\n✅ {tickets_pendientes.count()} tickets actualizados correctamente!")
    
    # Mostrar resumen de estados
    print("\n📊 Resumen de estados actuales:")
    estados = Ticket.objects.values_list('estado', flat=True).distinct()
    for estado in estados:
        count = Ticket.objects.filter(estado=estado).count()
        print(f"  {estado}: {count}")

if __name__ == '__main__':
    print("=" * 60)
    print("🔧 Corrigiendo estados de tickets...")
    print("=" * 60)
    fix_ticket_states()
    print("\n✅ Proceso completado!")
