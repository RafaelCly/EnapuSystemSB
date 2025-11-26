import pytest
from core.models import Usuario, Rol, NivelAcceso
from add_clients_refact import create_default_clients


@pytest.mark.django_db
def test_create_default_clients_crea_usuarios():
    rol = Rol.objects.create(rol="CLIENTE")
    nivel = NivelAcceso.objects.create(nivel="Básico")

    clientes = create_default_clients()

    assert len(clientes) >= 5
    assert Usuario.objects.filter(id_rol=rol).count() >= 5

