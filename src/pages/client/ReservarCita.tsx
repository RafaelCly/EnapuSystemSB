import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, Ship, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { apiFetch } from '@/lib/api';

interface Contenedor {
  id: number;
  codigo_barras: string;
  tipo: string;
  peso: number;
  dimensiones: string;
}

interface Buque {
  id: number;
  nombre: string;
  linea_naviera: string;
}

const ReservarCita: React.FC = () => {
  const navigate = useNavigate();
  const [contenedores, setContenedores] = useState<Contenedor[]>([]);
  const [buques, setBuques] = useState<Buque[]>([]);
  const [loading, setLoading] = useState(false);
  const [clienteId, setClienteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    id_contenedor: '',
    id_buque: '',
    fecha_envio: '',
    fecha_recojo: '',
    duracion_viaje_dias: ''
  });

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedUserId = localStorage.getItem('userId');
    
    if (storedRole !== 'CLIENTE') {
      navigate('/');
      return;
    }
    
    if (storedUserId) {
      setClienteId(Number(storedUserId));
    }
    
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [contenedoresData, buquesData] = await Promise.all([
        apiFetch('/contenedores/'),
        apiFetch('/buques/')
      ]);
      
      setContenedores(contenedoresData || []);
      setBuques(buquesData || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularDuracion = useCallback(() => {
    if (form.fecha_envio && form.fecha_recojo) {
      const envio = new Date(form.fecha_envio);
      const recojo = new Date(form.fecha_recojo);
      const diferencia = Math.ceil((recojo.getTime() - envio.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diferencia > 0) {
        setForm(prev => ({ ...prev, duracion_viaje_dias: String(diferencia) }));
      }
    }
  }, [form.fecha_envio, form.fecha_recojo]);

  useEffect(() => {
    calcularDuracion();
  }, [calcularDuracion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.id_contenedor || !form.id_buque || !form.fecha_envio || !form.fecha_recojo) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (new Date(form.fecha_recojo) <= new Date(form.fecha_envio)) {
      alert('La fecha de recojo debe ser posterior a la fecha de envío');
      return;
    }

    setLoading(true);
    try {
      // 1. Crear la cita
      const citaPayload = {
        fecha_envio: form.fecha_envio,
        fecha_recojo: form.fecha_recojo,
        duracion_viaje_dias: Number(form.duracion_viaje_dias),
        estado: 'reservada',
        id_cliente: clienteId
      };

      const citaCreada = await apiFetch('/citas-recojo/', {
        method: 'POST',
        body: JSON.stringify(citaPayload)
      });

      // 2. Actualizar el contenedor con la cita
      await apiFetch(`/contenedores/${form.id_contenedor}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          id_cita_recojo: citaCreada.id,
          id_buque: Number(form.id_buque)
        })
      });

      alert('¡Reserva creada exitosamente! El operario escaneará el código de barras al recibir el contenedor.');
      setForm({
        id_contenedor: '',
        id_buque: '',
        fecha_envio: '',
        fecha_recojo: '',
        duracion_viaje_dias: ''
      });
      navigate('/client/my-tickets');
    } catch (error: unknown) {
      console.error('Error creando reserva:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la reserva';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { name: 'Dashboard', path: '/client/dashboard', icon: Calendar },
    { name: 'Reservar Cita', path: '/client/reservar', icon: Calendar },
    { name: 'Mis Reservas', path: '/client/my-tickets', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="CLIENTE" userName={localStorage.getItem('userName') || 'Cliente'} />
      <div className="flex">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Reservar Cita de Recojo</h1>
            <p className="text-muted-foreground mb-6">
              Complete los datos para reservar el recojo de su contenedor. El operario escaneará el código de barras al momento de la recepción.
            </p>

            {loading && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-700">
                Cargando datos...
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
              <div className="space-y-6">
                {/* Contenedor */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Package className="w-4 h-4" />
                    Contenedor *
                  </label>
                  <select
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={form.id_contenedor}
                    onChange={(e) => setForm({ ...form, id_contenedor: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar contenedor</option>
                    {contenedores.map((cont) => (
                      <option key={cont.id} value={cont.id}>
                        {cont.codigo_barras} - {cont.tipo} ({cont.dimensiones}, {cont.peso}kg)
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Seleccione el contenedor con código de barras que será enviado
                  </p>
                </div>

                {/* Buque */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Ship className="w-4 h-4" />
                    Buque *
                  </label>
                  <select
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={form.id_buque}
                    onChange={(e) => setForm({ ...form, id_buque: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar buque</option>
                    {buques.map((buque) => (
                      <option key={buque.id} value={buque.id}>
                        {buque.nombre} - {buque.linea_naviera}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Calendar className="w-4 h-4" />
                      Fecha de Envío *
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={form.fecha_envio}
                      onChange={(e) => setForm({ ...form, fecha_envio: e.target.value })}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Calendar className="w-4 h-4" />
                      Fecha de Recojo *
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={form.fecha_recojo}
                      onChange={(e) => setForm({ ...form, fecha_recojo: e.target.value })}
                      required
                      min={form.fecha_envio || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Duración calculada */}
                {form.duracion_viaje_dias && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Duración del viaje</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {form.duracion_viaje_dias} días
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Creando reserva...' : 'Confirmar Reserva'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/client/dashboard')}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>

            {/* Información adicional */}
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">ℹ️ Información importante</h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• El código de barras del contenedor contiene todos los datos de su reserva</li>
                <li>• El operario escaneará el código al recibir el contenedor en el puerto</li>
                <li>• Se le asignará automáticamente una ubicación (slot) disponible</li>
                <li>• Recibirá notificaciones del estado de su contenedor</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReservarCita;
