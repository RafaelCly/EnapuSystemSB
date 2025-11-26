-- Tablas de catalogo
DROP TABLE IF EXISTS Rol CASCADE;
CREATE TABLE Rol
(
  id INT NOT NULL,
  rol VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS Nivel_acceso CASCADE;
CREATE TABLE Nivel_acceso
(
  id INT NOT NULL,
  nivel VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

-- Tabla de Usuarios
DROP TABLE IF EXISTS Usuario CASCADE;
CREATE TABLE Usuario
(
  id INT NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  id_rol INT NOT NULL,
  id_nivel_acceso INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_rol) REFERENCES Rol(id),
  FOREIGN KEY (id_nivel_acceso) REFERENCES Nivel_acceso(id)
);

-- Tablas de Ubicacion
DROP TABLE IF EXISTS Zona CASCADE;
CREATE TABLE Zona
(
  id INT NOT NULL,
  nombre VARCHAR(25) NOT NULL,
  capacidad INT NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS Ubicacion_slot CASCADE;
CREATE TABLE Ubicacion_slot
(
  id INT NOT NULL,
  fila INT NOT NULL,
  columna INT NOT NULL,
  nivel INT NOT NULL,
  estado VARCHAR(20) NOT NULL, -- Tipo de dato corregido
  id_zona INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_zona) REFERENCES Zona(id)
);

-- Tablas de Buques y Contenedores
DROP TABLE IF EXISTS Buque CASCADE;
CREATE TABLE Buque
(
  id INT NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  linea_naviera VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS Cita_recojo CASCADE;
CREATE TABLE Cita_recojo
(
  id INT NOT NULL,
  fecha_inicio_horario DATE NOT NULL,   -- Tipo de dato corregido
  fecha_salida_horario DATE NOT NULL,    -- Tipo de dato corregido
  estado VARCHAR(50) NOT NULL,           -- Tipo de dato corregido
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS Contenedor CASCADE;
CREATE TABLE Contenedor
(
  id INT NOT NULL,
  dimensiones VARCHAR(50) NOT NULL, -- Tipo de dato corregido
  tipo VARCHAR(20) NOT NULL,        -- Tipo de dato corregido
  peso FLOAT NOT NULL,              -- Tipo de dato corregido
  id_buque INT NOT NULL,
  id_cita_recojo INT NOT NULL,      -- Corregida el nombre de la columna para la FK
  PRIMARY KEY (id),
  FOREIGN KEY (id_buque) REFERENCES Buque(id),
  FOREIGN KEY (id_cita_recojo) REFERENCES Cita_recojo(id)
);

-- Tablas de Operacion (Tickets y Facturacion)
DROP TABLE IF EXISTS Ticket CASCADE;
CREATE TABLE Ticket
(
  id INT NOT NULL,
  fecha_hora_entrada TIMESTAMP NOT NULL, -- Tipo de dato corregido
  fecha_hora_salida TIMESTAMP,  -- Tipo de dato corregido
  estado VARCHAR(50) NOT NULL,
  id_ubicacion INT NOT NULL,
  id_usuario INT NOT NULL,
  id_contenedor INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_ubicacion) REFERENCES Ubicacion_slot(id),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
  FOREIGN KEY (id_contenedor) REFERENCES Contenedor(id)
);

DROP TABLE IF EXISTS Factura CASCADE;
CREATE TABLE Factura
(
  id INT NOT NULL,
  fecha_emision DATE NOT NULL,      -- Tipo de dato corregido
  monto FLOAT NOT NULL,             -- Tipo de dato corregido
  estado VARCHAR(50) NOT NULL,      -- Tipo de dato corregido
  id_ticket INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_ticket) REFERENCES Ticket(id)
);

DROP TABLE IF EXISTS Pago CASCADE;
CREATE TABLE Pago
(
  id INT NOT NULL,
  fecha_pago DATE NOT NULL,
  medio_pago VARCHAR(30) NOT NULL, -- Tipo de dato corregido
  monto FLOAT NOT NULL,            -- Tipo de dato corregido
  id_factura INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_factura) REFERENCES Factura(id)
);

-- Tabla de Reportes
DROP TABLE IF EXISTS Reporte CASCADE;
CREATE TABLE Reporte
(
  id INT NOT NULL,
  tipo VARCHAR(50) NOT NULL,        -- Tipo de dato corregido
  fecha_generacion DATE NOT NULL,
  parametros VARCHAR(50) NOT NULL,  -- Tamano corregido
  PRIMARY KEY (id)
);