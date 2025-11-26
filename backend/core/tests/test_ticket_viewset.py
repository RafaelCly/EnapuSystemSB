"""
Pruebas adicionales para las acciones personalizadas del TicketViewSet.
"""
import uuid

import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from core.models import (
    Rol, NivelAcceso, Usuario, Zona, UbicacionSlot,
    Buque, Contenedor, Ticket
)


def _crear_usuario(email):
    """Crea y devuelve un usuario listo para asociar tickets."""
    rol = Rol.objects.create(rol="Operador")
    nivel = NivelAcceso.objects.create(nivel="Basico")
    return Usuario.objects.create(
        nombre=email.split('@')[0],
        email=email,
        id_rol=rol,
        id_nivel_acceso=nivel
    )


def _crear_ticket(usuario=None, estado="PENDIENTE"):
    """Genera un ticket con toda la infraestructura necesaria."""
    zona = Zona.objects.create(nombre=f"Zona {uuid.uuid4().hex[:4]}", capacidad=10)
    slot = UbicacionSlot.objects.create(fila=1, columna=1, nivel=1, estado="libre", id_zona=zona)
    if usuario is None:
        usuario = _crear_usuario(email=f"user_{uuid.uuid4().hex[:6]}@test.com")
    buque = Buque.objects.create(nombre="Test Buque", linea_naviera="Linea X")
    contenedor = Contenedor.objects.create(
        codigo_barras=f"CONT-{uuid.uuid4().hex}",
        dimensiones="20",
        tipo="Dry",
        peso=100,
        id_buque=buque
    )
    return Ticket.objects.create(
        fecha_hora_entrada=timezone.now(),
        estado=estado,
        id_ubicacion=slot,
        id_usuario=usuario,
        id_contenedor=contenedor
    )


@pytest.mark.django_db
def test_by_usuario_filtra_por_usuario_id(client):
    """El endpoint by_usuario debe devolver solo los tickets del usuario solicitado."""
    usuario_objetivo = _crear_usuario("target@test.com")
    _crear_ticket(usuario=usuario_objetivo, estado="PENDIENTE")
    _crear_ticket(estado="PENDIENTE")  # ticket de otro usuario

    url = reverse('ticket-by-usuario')
    response = client.get(url, {'usuario_id': usuario_objetivo.id})

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]['id_usuario'] == usuario_objetivo.id


@pytest.mark.django_db
def test_by_usuario_requiere_parametro(client):
    """Si falta el parametro usuario_id se debe retornar 400."""
    response = client.get(reverse('ticket-by-usuario'))

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'no especificado' in response.data['error'].lower()


@pytest.mark.django_db
def test_cambiar_estado_sin_estado(client):
    """La accion cambiar_estado debe requerir el campo 'estado'."""
    ticket = _crear_ticket(estado="EN_PROCESO")
    url = reverse('ticket-cambiar-estado', args=[ticket.id])

    response = client.patch(url, {}, content_type='application/json')

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'no especificado' in response.data['error'].lower()


@pytest.mark.django_db
def test_cambiar_estado_no_asigna_salida_para_estados_distintos(client):
    """Solo al pasar a 'Completado' se debe registrar la salida."""
    ticket = _crear_ticket(estado="EN_PROCESO")
    url = reverse('ticket-cambiar-estado', args=[ticket.id])

    response = client.patch(url, {'estado': 'EN_PROCESO'}, content_type='application/json')
    ticket.refresh_from_db()

    assert response.status_code == status.HTTP_200_OK
    assert ticket.estado == 'EN_PROCESO'
    assert ticket.fecha_hora_salida is None


@pytest.mark.django_db
def test_by_estado_requiere_parametro(client):
    """El endpoint by_estado debe validar la presencia del parametro."""
    response = client.get(reverse('ticket-by-estado'))

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'no especificado' in response.data['error'].lower()
