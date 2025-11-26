import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import DataTable from '@/components/DataTable';
import { api } from '@/lib/api';

interface Contenedor {
  id: number;
  codigo_contenedor: string;
  dimensiones: string;
  tipo: string;
  peso: number;
  id_buque: number;
  [key: string]: unknown;
}

interface Buque {
  id: number;
  nombre: string;
  linea_naviera: string;
  [key: string]: unknown;
}

const ContenedoresView: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Contenedor[]>([]);
  const [buques, setBuques] = useState<Buque[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    codigo_contenedor: '',
    dimensiones: '12.19x2.44x2.59',
    tipo: 'Seco',
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
        api.contenedores.list(),
        api.buques.list()
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

    if (!form.codigo_contenedor || !form.tipo || !form.peso) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }    setLoading(true);
    try {
      const payload = {
        codigo_contenedor: form.codigo_contenedor,
        dimensiones: form.dimensiones,
        tipo: form.tipo,
        peso: Number(form.peso),
        id_buque: Number(form.id_buque)
      };

      if (editingId) {
        await api.contenedores.update(editingId, payload);
        alert('Contenedor actualizado exitosamente');
      } else {
        await api.contenedores.create(payload);
        alert('Contenedor creado exitosamente');
      }      await loadData();
      setForm({ codigo_contenedor: '', dimensiones: '12.19x2.44x2.59', tipo: 'Seco', peso: '', id_buque: '' });
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
      await api.contenedores.delete(id);
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
    { 
      key: 'codigo_contenedor', 
      label: 'Código',
      render: (value: unknown) => (
        <span className="font-mono text-sm font-semibold">{String(value) || 'N/A'}</span>
      )
    },
    { key: 'dimensiones', label: 'Dimensiones' },
    { 
      key: 'tipo', 
      label: 'Tipo',
      render: (value: unknown) => {
        const tipos: Record<string, string> = {
          "Seco": "bg-blue-500 text-white",
          "Refrigerado": "bg-cyan-500 text-white",
          "Open Top": "bg-purple-500 text-white",
          "Flat Rack": "bg-orange-500 text-white",
          "Tanque": "bg-amber-500 text-white"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipos[String(value)] || "bg-gray-400 text-white"}`}>
            {String(value) || 'N/A'}
          </span>
        );
      }
    },
    { 
      key: 'peso', 
      label: 'Peso (kg)',
      render: (value: unknown) => value ? `${Number(value).toLocaleString()} kg` : 'N/A'
    },
    { key: 'id_buque', label: 'Buque ID' },
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
                  <label className="block text-sm font-medium mb-1">Código Contenedor *</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="MSCU1234567"
                    value={form.codigo_contenedor}
                    onChange={(e) => setForm({ ...form, codigo_contenedor: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Dimensiones *</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="12.19x2.44x2.59"
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
                    <option value="Seco">Seco</option>
                    <option value="Refrigerado">Refrigerado</option>
                    <option value="Open Top">Open Top</option>
                    <option value="Flat Rack">Flat Rack</option>
                    <option value="Tanque">Tanque</option>
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
                  <label className="block text-sm font-medium mb-1">Buque</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={form.id_buque}
                    onChange={(e) => setForm({ ...form, id_buque: e.target.value })}
                  >
                    <option value="">Seleccione un buque</option>
                    {buques.map((buque) => (
                      <option key={buque.id} value={buque.id}>
                        {buque.nombre} - {buque.linea_naviera}
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
                      setForm({ codigo_contenedor: '', dimensiones: '12.19x2.44x2.59', tipo: 'Seco', peso: '', id_buque: '' });
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
                          codigo_contenedor: row.codigo_contenedor || '',
                          dimensiones: row.dimensiones || '12.19x2.44x2.59',
                          tipo: row.tipo || 'Seco',
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
            searchKeys={['codigo_contenedor', 'tipo']}
          />
    </AdminLayout>
  );
};

export default ContenedoresView;
