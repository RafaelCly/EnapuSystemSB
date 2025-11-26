import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import DataTable from '@/components/DataTable';
import { apiFetch } from '@/lib/api';

interface Zona {
  id: number;
  nombre: string;
  capacidad: number;
  estado: string;
  [key: string]: unknown;
}

const ZonasView: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Zona[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    capacidad: '',
    estado: 'activa'
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole !== 'ADMINISTRADOR') {
      navigate('/');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const zonas = await apiFetch('/zonas/');
      setData(zonas || []);
    } catch (error) {
      console.error('Error cargando zonas:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre || !form.capacidad) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nombre: form.nombre,
        capacidad: Number(form.capacidad),
        estado: form.estado
      };

      if (editingId) {
        await apiFetch(`/zonas/${editingId}/`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        alert('Zona actualizada exitosamente');
      } else {
        await apiFetch('/zonas/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        alert('Zona creada exitosamente');
      }

      await loadData();
      setForm({ nombre: '', capacidad: '', estado: 'activa' });
      setEditingId(null);
    } catch (err: unknown) {
      console.error('Error guardando zona:', err);
      const error = err as Error;
      alert(`Error: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta zona? Se eliminarán también los slots asociados.')) return;

    try {
      await apiFetch(`/zonas/${id}/`, { method: 'DELETE' });
      await loadData();
      alert('Zona eliminada exitosamente');
    } catch (error) {
      console.error('Error eliminando zona:', error);
      alert('Error al eliminar zona');
    }
  };

  const userName = localStorage.getItem('userName') || 'Admin';

  interface Column {
    key: string;
    label: string;
    render?: (value: unknown, row?: unknown) => React.ReactNode;
  }

  const columns: Column[] = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'capacidad', label: 'Capacidad' },
    { key: 'estado', label: 'Estado' },
  ];

  return (
    <AdminLayout userName={userName}>
      <h1 className="text-3xl font-bold mb-6">Gestión de Zonas</h1>

          {loading && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-700">
              Cargando zonas...
            </div>
          )}

          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Editar Zona' : 'Crear Nueva Zona'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre *</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Ej: Zona A"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Capacidad *</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="100"
                    value={form.capacidad}
                    onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  >
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                    <option value="mantenimiento">Mantenimiento</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  {editingId ? 'Guardar cambios' : 'Crear Zona'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ nombre: '', capacidad: '', estado: 'activa' });
                    }}
                    className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <DataTable
            columns={columns.concat([
              {
                key: 'actions',
                label: 'Acciones',
                render: (_: unknown, row: Zona) => (
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 bg-amber-500 text-white rounded"
                      onClick={() => {
                        setEditingId(row.id);
                        setForm({
                          nombre: row.nombre,
                          capacidad: String(row.capacidad),
                          estado: row.estado || 'activa',
                        });
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded"
                      onClick={() => handleDelete(row.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ),
              },
            ])}
            data={data}
            searchKeys={['nombre', 'estado']}
          />
    </AdminLayout>
  );
};

export default ZonasView;
