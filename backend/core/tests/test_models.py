"""
Tests unitarios para verificar la funcionalidad bÃ¡sica de los modelos de Django.

Utiliza pytest-django para interactuar con la base de datos de prueba y asegurar
la integridad de las entidades principales y sus relaciones.
"""
from datetime import datetime, date

import pytest
from django.db import IntegrityError

# Importa todos tus modelos de la app 'core'
from core.models import (
    Rol, NivelAcceso, Usuario, Zona, UbicacionSlot, Buque,
    CitaRecojo, Contenedor, Ticket, Factura, Pago, Reporte
)

# El marcador '@pytest.mark.django_db' es esencial.
# Le da a la prueba acceso a una base de datos de prueba.

@pytest.mark.django_db
def test_crear_rol():
    """Verifica la creaciÃ³n y representaciÃ³n (str) del modelo Rol."""
    # 1. Arrange & 2. Act
    rol = Rol.objects.create(rol="Administrador")

    # 3. Assert
    assert rol.rol == "Administrador"
    assert str(rol) == "Administrador"
# C0303 Corregido: Eliminado trailing whitespace

@pytest.mark.django_db
def test_crear_nivel_acceso():
    """Verifica la creaciÃ³n y representaciÃ³n (str) del modelo NivelAcceso."""
    # 1. Arrange & 2. Act
    nivel = NivelAcceso.objects.create(nivel="Acceso Total")

    # 3. Assert
    assert nivel.nivel == "Acceso Total"
    assert str(nivel) == "Acceso Total"
# C0303 Corregido: Eliminado trailing whitespace

@pytest.mark.django_db
def test_crear_usuario():
    """Verifica la creaciÃ³n de un Usuario y sus campos por defecto."""
    # 1. Arrange (Organizar las dependencias)
    rol = Rol.objects.create(rol="Cliente")
    nivel = NivelAcceso.objects.create(nivel="Nivel 1")

    # 2. Act (Crear el objeto a probar)
    user = Usuario.objects.create(
        nombre="Juan Perez",
        email="juan.perez@email.com",
        password="password123",
        id_rol=rol,
        id_nivel_acceso=nivel
    )

    # 3. Assert (Verificar los datos)
    assert user.nombre == "Juan Perez"
    assert user.id_rol.rol == "Cliente"
    assert user.activo is True  # Probar el valor por defecto
    assert user.fecha_creacion is not None # Probar auto_now_add
    assert str(user) == "Juan Perez"
# C0303 Corregido: Eliminado trailing whitespace

@pytest.mark.django_db
def test_usuario_email_unique():
    """Verifica que no se puede crear un Usuario con un email duplicado (IntegrityError)."""
    # 1. Arrange
    rol = Rol.objects.create(rol="Cliente")
    nivel = NivelAcceso.objects.create(nivel="Nivel 1")
    Usuario.objects.create(
        nombre="Usuario Uno",
        email="unico@email.com",
        id_rol=rol,
        id_nivel_acceso=nivel
    )

    # 2. Act & 3. Assert
    # Verificamos que crear un usuario con el mismo email lanza un IntegrityError
    with pytest.raises(IntegrityError):
        Usuario.objects.create(
            nombre="Usuario Dos",
            email="unico@email.com", # Email repetido
            id_rol=rol,
            id_nivel_acceso=nivel
        )
# C0303 Corregido: Eliminado trailing whitespace

@pytest.mark.django_db
def test_crear_zona_y_ubicacion():
    """Verifica la relaciÃ³n entre Zona y UbicacionSlot."""
    # 1. Arrange
    zona = Zona.objects.create(nombre="Zona A", capacidad=100)

    # 2. Act
    slot = UbicacionSlot.objects.create(
        fila=1,
        columna=5,
        nivel=2,
        estado="disponible",
        id_zona=zona
    )

    # 3. Assert
    assert zona.capacidad == 100
    assert str(zona) == "Zona A"
    assert slot.id_zona.nombre == "Zona A"
    assert slot.estado == "disponible"
    # C0301 Corregido: LÃ­nea larga
    assert str(slot) == f"Slot {slot.id} - Zona {zona}"
# C0303 Corregido: Eliminado trailing whitespace

@pytest.mark.django_db
def test_crear_buque():
    """Verifica la creaciÃ³n y representaciÃ³n (str) del modelo Buque."""
    # 1. Arrange & 2. Act
    buque = Buque.objects.create(
        nombre="La Perla",
        linea_naviera="Maersk"
    )

    # 3. Assert
    assert buque.nombre == "La Perla"
    assert str(buque) == "La Perla"
# C0303 Corregido: Eliminado trailing whitespace

@pytest.mark.django_db
def test_crear_cita_recojo():
    """Verifica la creaciÃ³n de CitaRecojo y sus valores por defecto."""
    # 1. Arrange & 2. Act
    cita = CitaRecojo.objects.create(
        fecha_recojo=date(2025, 12, 1),
        duracion_viaje_dias=10
    )

    # 3. Assert
    assert cita.estado == "reservada" # Probar el valor por defecto
    assert cita.duracion_viaje_dias == 10
    assert cita.fecha_creacion is not None
    assert str(cita) == f"Cita {cita.id} - reservada"
# C0303 Corregido: Eliminado trailing whitespace

@pytest.mark.django_db
def test_crear_contenedor():
    """Verifica la creaciÃ³n de Contenedor y su relaciÃ³n con Buque."""
    # 1. Arrange
    buque = Buque.objects.create(nombre="El Veloz", linea_naviera="CMA CGM")

    # 2. Act
    contenedor = Contenedor.objects.create(
        codigo_barras="CONT-12345",
        dimensiones="40ft",
        tipo="Refrigerado",
        peso=4500.75,
        id_buque=buque
    )

    # 3. Assert
    assert contenedor.peso == 4500.75
    assert contenedor.id_buque.nombre == "El Veloz"
    assert str(contenedor) == "Contenedor CONT-12345 - Refrigerado"
# C0303 Corregido: Eliminado trailing whitespace

@pytest.mark.django_db
def test_contenedor_codigo_barras_unique():
    """Verifica que el campo codigo_barras sea Ãºnico (IntegrityError)."""
    # 1. Arrange
    buque = Buque.objects.create(nombre="El Veloz", linea_naviera="CMA CGM")
    Contenedor.objects.create(
        codigo_barras="UNIQUE-987",
        dimensiones="20ft",
        tipo="Dry",
        peso=2000,
        id_buque=buque
    )

    # 2. Act & 3. Assert
    with pytest.raises(IntegrityError):
        Contenedor.objects.create(
            codigo_barras="UNIQUE-987", # CÃ³digo repetido
            dimensiones="40ft",
            tipo="Dry",
            peso=4000,
            id_buque=buque
        )
# C0303 Corregido: Eliminado trailing whitespace

@pytest.mark.django_db
def test_crear_ticket_factura_y_pago():
    """Verifica la cadena de dependencias: Ticket -> Factura -> Pago."""
    # 1. Arrange (Cadena de dependencias)

    # Dependencias de Ticket
    zona = Zona.objects.create(nombre="Patio 1", capacidad=50)
    slot = UbicacionSlot.objects.create(fila=1, columna=1, nivel=1, estado="ocupado", id_zona=zona)
    rol = Rol.objects.create(rol="Operador")
    nivel = NivelAcceso.objects.create(nivel="Nivel 2")
    user = Usuario.objects.create(
        nombre="Operador 1",
        email="op1@email.com",
        id_rol=rol,
        id_nivel_acceso=nivel
    )
    buque = Buque.objects.create(
        nombre="El Gigante",
        linea_naviera="MSC"
    )
    contenedor = Contenedor.objects.create(
        codigo_barras="GIGA-001",
        dimensiones="40ft",
        tipo="Dry",
        peso=3000,
        id_buque=buque
    )

    # 2. Act (Crear Ticket)
    ticket = Ticket.objects.create(
        fecha_hora_entrada=datetime.now(),
        estado="INGRESADO",
        id_ubicacion=slot,
        id_usuario=user,
        id_contenedor=contenedor
    )

    # 3. Assert (Ticket)
    assert ticket.estado == "INGRESADO"
    assert ticket.id_contenedor.codigo_barras == "GIGA-001"
    expected_str = f"Ticket {ticket.id} - INGRESADO"
    assert str(ticket) == expected_str
    # C0303 Corregido: Eliminado trailing whitespace

    # 2. Act (Crear Factura)
    factura = Factura.objects.create(
        fecha_emision=date.today(),
        monto=250.50,
        estado="PENDIENTE",
        id_ticket=ticket
    )

    # 3. Assert (Factura)
    assert factura.monto == 250.50
    assert factura.id_ticket.id == ticket.id
    assert str(factura) == f"Factura {factura.id} - PENDIENTE"
    # C0303 Corregido: Eliminado trailing whitespace

    # 2. Act (Crear Pago)
    pago = Pago.objects.create(
        fecha_pago=date.today(),
        medio_pago="VISA",
        monto=250.50,
        id_factura=factura
    )

    # 3. Assert (Pago)
    assert pago.medio_pago == "VISA"
    assert pago.id_factura.estado == "PENDIENTE"
    assert str(pago) == f"Pago {pago.id} - 250.50"
# C0303 Corregido: Eliminado trailing whitespace

@pytest.mark.django_db
def test_crear_reporte():
    """Verifica la creaciÃ³n y representaciÃ³n (str) del modelo Reporte."""
    # 1. Arrange & 2. Act
    reporte = Reporte.objects.create(
        tipo="Ocupacion Mensual",
        fecha_generacion=date.today(),
        parametros="zona=A;mes=11"
    )

    # 3. Assert
    assert reporte.tipo == "Ocupacion Mensual"
    assert str(reporte) == f"Reporte {reporte.id} - Ocupacion Mensual"
# C0304 Corregido: Se aÃ±adiÃ³ el salto de lÃ­nea al final del archivo.
