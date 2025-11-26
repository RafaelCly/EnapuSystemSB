#!/usr/bin/env bash
# exit on error
set -o errexit

# Instalar dependencias
pip install -r requirements.txt

# Ir a la carpeta backend
cd backend

# Recolectar archivos estáticos
python manage.py collectstatic --no-input

# Aplicar migraciones
python manage.py migrate

# Crear datos iniciales (opcional, comentar si ya existen)
python manage.py create_initial_data || echo "Datos ya existen o comando no disponible"
