import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import DataTable from '@/components/DataTable';
import { apiFetch } from '@/lib/api';

interface Contenedor {
  id: number;
  codigo_barras: string;
  numero_contenedor: string;
  dimensiones: string;
  tipo: string;
  peso: number;
  estado: string;
  [key: string]: unknown;
}

interface Buque {
  id: number;
  nombre: string;
  codigo_omi: string;
  [key: string]: unknown;
}

const ContenedoresView: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Contenedor[]>([]);
  const [buques, setBuques] = useState<Buque[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    codigo_barras: '',
    numero_contenedor: '',
    dimensiones: '20x8x8',
    tipo: '20ft',
    peso: '',
    id_buque: ''
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
      const [contenedores, buquesData] = await Promise.all([
        apiFetch('/contenedores/'),
        apiFetch('/buques/')
      ]);
      setData(contenedores || []);
      setBuques(buquesData || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setData([]);
      setBuques([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.numero_contenedor || !form.tipo || !form.peso) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }    setLoading(true);
    try {
      const payload: Partial<Contenedor> & {id_buque: number} = {
        codigo_barras: form.codigo_barras,
        numero_contenedor: form.numero_contenedor,
        dimensiones: form.dimensiones,
        tipo: form.tipo,
        peso: Number(form.peso),
        id_buque: Number(form.id_buque)
      };

      if (editingId) {
        await apiFetch(`/contenedores/${editingId}/`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        alert('Contenedor actualizado exitosamente');
      } else {
        await apiFetch('/contenedores/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        alert('Contenedor creado exitosamente');
      }      await loadData();
      setForm({ codigo_barras: '', numero_contenedor: '', dimensiones: '20x8x8', tipo: '20ft', peso: '', id_buque: '' });
      setEditingId(null);
    } catch (err: unknown) {
      console.error('Error guardando contenedor:', err);
      const error = err as Error;
      alert(`Error: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este contenedor?')) return;

    try {
      await apiFetch(`/contenedores/${id}/`, { method: 'DELETE' });
      await loadData();
      alert('Contenedor eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando contenedor:', error);
      alert('Error al eliminar contenedor');
    }
  };

  const userName = localStorage.getItem('userName') || 'Admin';
  const columns: Array<{key: string; label: string; render?: (value: unknown, row: Contenedor) => React.ReactNode}> = [
    { key: 'id', label: 'ID' },
    { key: 'codigo_barras', label: 'Código Barras' },
    { key: 'numero_contenedor', label: 'Número' },
    { key: 'dimensiones', label: 'Dimensiones' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'peso', label: 'Peso (kg)' },
  ];

  return (
    <AdminLayout userName={userName}>
      <h1 className="text-3xl font-bold mb-6">Gestión de Contenedores</h1>

          {loading && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-700">
              Cargando contenedores...
            </div>
          )}

          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Editar Contenedor' : 'Crear Nuevo Contenedor'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Código Barras * (único)</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="CONT-2024-001"
                    value={form.codigo_barras}
                    onChange={(e) => setForm({ ...form, codigo_barras: e.target.value.toUpperCase() })}
                    required
                  />
                  <span className="text-xs text-gray-500">Para escaneo</span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Número Contenedor *</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="ABCD1234567"
                    value={form.numero_contenedor}
                    onChange={(e) => setForm({ ...form, numero_contenedor: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Dimensiones *</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="20x8x8"
                    value={form.dimensiones}
                    onChange={(e) => setForm({ ...form, dimensiones: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tipo *</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    required
                  >
                    <option value="20ft">20 pies</option>
                    <option value="40ft">40 pies</option>
                    <option value="40ft HC">40 pies HC</option>
                    <option value="45ft">45 pies</option>
                    <option value="refrigerado">Refrigerado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Peso (kg) *</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="25000"
                    value={form.peso}
                    onChange={(e) => setForm({ ...form, peso: e.target.value })}
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Buque *</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={form.id_buque}
                    onChange={(e) => setForm({ ...form, id_buque: e.target.value })}
                    required
                  >
                    <option value="">Seleccione un buque</option>
                    {buques.map((buque) => (
                      <option key={buque.id} value={buque.id}>
                        {buque.nombre} ({buque.codigo_omi})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  {editingId ? 'Guardar cambios' : 'Crear Contenedor'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ codigo_barras: '', numero_contenedor: '', dimensiones: '20x8x8', tipo: '20ft', peso: '', id_buque: '' });
                    }}
                    className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>          <DataTable
            columns={columns.concat([
              {
                key: 'actions',
                label: 'Acciones',
                render: (_: unknown, row: Contenedor) => (
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 bg-amber-500 text-white rounded"
                      onClick={() => {
                        setEditingId(row.id);
                        setForm({
                          codigo_barras: row.codigo_barras || '',
                          numero_contenedor: row.numero_contenedor || '',
                          dimensiones: row.dimensiones || '20x8x8',
                          tipo: row.tipo || '20ft',
                          peso: String(row.peso || ''),
                          id_buque: String(row.id_buque || '')
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
            searchKeys={['codigo_barras', 'numero_contenedor', 'tipo']}
          />
    </AdminLayout>
  );
};

export default ContenedoresView;
