import pytest
from core.models import Usuario, Rol, NivelAcceso
from add_clients import add_clients


@pytest.mark.django_db
def test_add_clients_crea_usuarios():
    rol = Rol.objects.create(rol="CLIENTE")
    nivel = NivelAcceso.objects.create(nivel="Básico")

    clientes = add_clients()

    assert len(clientes) >= 5
    assert Usuario.objects.filter(id_rol=rol).count() >= 5
