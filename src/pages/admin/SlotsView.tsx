import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import DataTable from '@/components/DataTable';
import { apiFetch } from '@/lib/api';

interface Zona {
  id: number;
  nombre: string;
  capacidad: number;
}

interface Slot {
  id: number;
  fila: string;
  columna: string;
  nivel: string;
  capacidad: number;
  estado: string;
  id_zona: number;
  zona_nombre?: string;
  [key: string]: unknown;
}

const SlotsView: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Slot[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fila: '',
    columna: '',
    nivel: '',
    estado: 'disponible',
    id_zona: ''
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
      const [slotsData, zonasData] = await Promise.all([
        apiFetch('/ubicaciones-slot/'),
        apiFetch('/zonas/')
      ]);
      
      setData(slotsData || []);
      setZonas(zonasData || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fila || !form.columna || !form.nivel || !form.id_zona) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fila: form.fila,
        columna: form.columna,
        nivel: form.nivel,
        estado: form.estado,
        id_zona: Number(form.id_zona)
      };

      if (editingId) {
        await apiFetch(`/ubicaciones-slot/${editingId}/`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        alert('Slot actualizado exitosamente');
      } else {
        await apiFetch('/ubicaciones-slot/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        alert('Slot creado exitosamente');
      }

      await loadData();
      setForm({ fila: '', columna: '', nivel: '', estado: 'disponible', id_zona: '' });
      setEditingId(null);
    } catch (err: unknown) {
      console.error('Error guardando slot:', err);
      const error = err as Error;
      alert(`Error: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este slot?')) return;

    try {
      await apiFetch(`/ubicaciones-slot/${id}/`, { method: 'DELETE' });
      await loadData();
      alert('Slot eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando slot:', error);
      alert('Error al eliminar slot');
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
    { key: 'fila', label: 'Fila' },
    { key: 'columna', label: 'Columna' },
    { key: 'nivel', label: 'Nivel' },
    { 
      key: 'id_zona', 
      label: 'Zona',
      render: (value: unknown) => {
        const zona = zonas.find(z => z.id === value);
        return zona ? zona.nombre : `ID: ${value}`;
      }
    },
    { key: 'estado', label: 'Estado' },
  ];

  return (
    <AdminLayout userName={userName}>
          <h1 className="text-3xl font-bold mb-6">Gestión de Slots (Ubicaciones)</h1>

          {loading && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-700">
              Cargando slots...
            </div>
          )}

          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Editar Slot' : 'Crear Nuevo Slot'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fila *</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="A, B, C..."
                    value={form.fila}
                    onChange={(e) => setForm({ ...form, fila: e.target.value.toUpperCase() })}
                    required
                    maxLength={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Columna *</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="01, 02..."
                    value={form.columna}
                    onChange={(e) => setForm({ ...form, columna: e.target.value })}
                    required
                    maxLength={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nivel *</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="1, 2, 3..."
                    value={form.nivel}
                    onChange={(e) => setForm({ ...form, nivel: e.target.value })}
                    required
                    maxLength={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Zona *</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={form.id_zona}
                    onChange={(e) => setForm({ ...form, id_zona: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {zonas.map((zona) => (
                      <option key={zona.id} value={zona.id}>
                        {zona.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="ocupado">Ocupado</option>
                    <option value="reservado">Reservado</option>
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
                  {editingId ? 'Guardar cambios' : 'Crear Slot'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ fila: '', columna: '', nivel: '', estado: 'disponible', id_zona: '' });
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
                render: (_: unknown, row: Slot) => (
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 bg-amber-500 text-white rounded"
                      onClick={() => {
                        setEditingId(row.id);
                        setForm({
                          fila: row.fila,
                          columna: row.columna,
                          nivel: row.nivel,
                          estado: row.estado || 'disponible',
                          id_zona: String(row.id_zona)
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
            searchKeys={['fila', 'columna', 'nivel', 'estado']}
          />
    </AdminLayout>
  );
};

export default SlotsView;
