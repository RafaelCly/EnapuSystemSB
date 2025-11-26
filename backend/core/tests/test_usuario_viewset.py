"""
Pruebas adicionales para el UsuarioViewSet, enfocadas en la lógica de login
y en el filtrado por rol a través de las acciones personalizadas.
"""
import pytest
from django.urls import reverse
from django.contrib.auth.hashers import make_password
from rest_framework import status

from core.models import Rol, NivelAcceso, Usuario


def _crear_usuario(email="user@test.com", activo=True):
    """Crea un usuario con rol y nivel de acceso listo para usarse en las pruebas."""
    rol = Rol.objects.create(rol="Tester")
    nivel = NivelAcceso.objects.create(nivel="Total")
    return Usuario.objects.create(
        nombre="Usuario Test",
        email=email,
        password=make_password("password123"),
        id_rol=rol,
        id_nivel_acceso=nivel,
        activo=activo
    )


@pytest.mark.django_db
def test_login_campos_obligatorios(client):
    """Si falta email o password, la vista debe responder 400."""
    url = reverse('usuario-login')
    response = client.post(url, {'email': 'falta_password'}, content_type='application/json')

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'requeridos' in response.data['error'].lower()


@pytest.mark.django_db
def test_login_usuario_inactivo(client):
    """Un usuario inactivo no debería poder autenticarse."""
    _crear_usuario(email="inactivo@test.com", activo=False)

    url = reverse('usuario-login')
    data = {'email': 'inactivo@test.com', 'password': 'password123'}
    response = client.post(url, data, content_type='application/json')

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert 'no encontrado' in response.data['error'].lower()


@pytest.mark.django_db
def test_by_role_retorna_solo_activos(client):
    """La acción personalizada debe devolver únicamente usuarios activos."""
    _crear_usuario(email="activo@test.com", activo=True)
    _crear_usuario(email="inactivo@test.com", activo=False)

    url = reverse('usuario-by-role')
    response = client.get(url, {'role': 'Tester'})

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]['email'] == 'activo@test.com'


@pytest.mark.django_db
def test_by_role_requiere_parametro(client):
    """Si no se proporciona el rol, debe devolver un error 400."""
    response = client.get(reverse('usuario-by-role'))

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'no especificado' in response.data['error'].lower()
