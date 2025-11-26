import React, { useState, useEffect, useCallback } from 'react';
import OperatorLayout from '../../components/OperatorLayout';
import { apiFetch } from '../../lib/api';
import { Scan, Package, Calendar, MapPin, User, CheckCircle, X } from 'lucide-react';

interface ContenedorInfo {
  id: number;
  codigo_barras: string;
  tipo: string;
  peso: number;
  dimensiones: string;
  buque_nombre: string;
  cita_info: {
    fecha_envio: string;
    fecha_recojo: string;
    cliente: string;
    estado: string;
  } | null;
}

interface Zona {
  id: number;
  nombre: string;
}

interface Slot {
  id: number;
  fila: string;
  columna: string;
  nivel: string;
  estado: string;
  id_zona: number;
  zona_nombre?: string;
}

const ScanTicket: React.FC = () => {
  const [codigoBarras, setCodigoBarras] = useState('');
  const [contenedorInfo, setContenedorInfo] = useState<ContenedorInfo | null>(null);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedZona, setSelectedZona] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadZonas();
  }, []);

  useEffect(() => {
    if (selectedZona) {
      loadSlotsByZona(Number(selectedZona));
    } else {
      setSlots([]);
      setSelectedSlot('');
    }
  }, [selectedZona, loadSlotsByZona]);

  const loadZonas = async () => {
    try {
      const zonasData = await apiFetch('/zonas/');
      setZonas(zonasData || []);
    } catch (error) {
      console.error('Error cargando zonas:', error);
    }
  };

  const loadSlotsByZona = useCallback(async (zonaId: number) => {
    try {
      const slotsData = await apiFetch('/ubicaciones-slot/');
      const slotsDisponibles = slotsData.filter(
        (s: Slot) => s.id_zona === zonaId && s.estado.toLowerCase() === 'disponible'
      );
      
      const zona = zonas.find(z => z.id === zonaId);
      const slotsConZona = slotsDisponibles.map((s: Slot) => ({
        ...s,
        zona_nombre: zona?.nombre || ''
      }));
      
      setSlots(slotsConZona);
    } catch (error) {
      console.error('Error cargando slots:', error);
    }
  }, [zonas]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigoBarras.trim()) {
      setError('Por favor ingrese un código de barras');
      return;
    }

    setLoading(true);
    setError('');
    setContenedorInfo(null);

    try {
      // Buscar contenedor por código de barras
      const contenedores = await apiFetch(`/contenedores/`);
      const contenedor = contenedores.find(
        (c: ContenedorInfo) => c.codigo_barras === codigoBarras.trim()
      );

      if (!contenedor) {
        setError('❌ Contenedor no encontrado. Verifique el código de barras.');
        return;
      }

      if (!contenedor.cita_info) {
        setError('❌ Este contenedor no tiene una cita/reserva asociada. Solo se pueden validar contenedores con reserva confirmada de la empresa transportista.');
        return;
      }

      // Verificar que el contenedor no tenga ticket ya creado
      const tickets = await apiFetch('/tickets/');
      const ticketExistente = tickets.find((t: Record<string, unknown>) => t.id_contenedor === contenedor.id);
      
      if (ticketExistente) {
        setError(`❌ Este contenedor ya fue procesado. Ticket #${ticketExistente.id} creado anteriormente (Estado: ${ticketExistente.estado}).`);
        return;
      }

      // Verificar que la fecha actual esté dentro del rango
      const hoy = new Date().toISOString().split('T')[0];
      if (hoy < contenedor.cita_info.fecha_envio) {
        setError(`❌ La fecha de envío es ${contenedor.cita_info.fecha_envio}. Aún no es válido recibir este contenedor.`);
        return;
      }

      if (hoy > contenedor.cita_info.fecha_recojo) {
        setError(`⚠️ ADVERTENCIA: La fecha de recojo era ${contenedor.cita_info.fecha_recojo}. Este contenedor está retrasado.`);
      }

      setContenedorInfo(contenedor);
    } catch (error: unknown) {
      console.error('Error buscando contenedor:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(`Error al buscar contenedor: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSlot = async () => {
    if (!contenedorInfo || !selectedSlot) {
      alert('Por favor seleccione una ubicación (slot)');
      return;
    }

    setLoading(true);
    try {
      // Buscar el cliente asociado a la cita
      const citas = await apiFetch('/citas-recojo/');
      const cita = citas.find((c: Record<string, unknown>) => 
        c.fecha_envio === contenedorInfo.cita_info?.fecha_envio &&
        c.fecha_recojo === contenedorInfo.cita_info?.fecha_recojo
      );

      if (!cita || !cita.id_cliente) {
        alert('Error: No se encontró el cliente asociado a esta reserva');
        return;
      }

      // Crear el ticket
      const ticketPayload = {
        fecha_hora_entrada: new Date().toISOString(),
        estado: 'Validado',
        id_ubicacion: Number(selectedSlot),
        id_usuario: cita.id_cliente, // El cliente que hizo la reserva
        id_contenedor: contenedorInfo.id
      };

      await apiFetch('/tickets/', {
        method: 'POST',
        body: JSON.stringify(ticketPayload)
      });

      // Actualizar estado del slot a ocupado
      await apiFetch(`/ubicaciones-slot/${selectedSlot}/`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: 'ocupado' })
      });

      // Actualizar estado de la cita a en_proceso
      if (cita) {
        await apiFetch(`/citas-recojo/${cita.id}/`, {
          method: 'PATCH',
          body: JSON.stringify({ estado: 'en_proceso' })
        });
      }

      alert('✅ Ticket creado exitosamente! El contenedor ha sido asignado.');
      
      // Reset form
      setCodigoBarras('');
      setContenedorInfo(null);
      setSelectedZona('');
      setSelectedSlot('');
      setError('');
    } catch (error: unknown) {
      console.error('Error creando ticket:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el ticket';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCodigoBarras('');
    setContenedorInfo(null);
    setSelectedZona('');
    setSelectedSlot('');
    setError('');
  };

  return (
    <OperatorLayout>
      <div className="p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-2">Validar Contenedor</h1>
        <p className="text-muted-foreground mb-6">
          Escanee o busque el contenedor para validar su reserva y asignar ubicación en el puerto
        </p>

        {/* Formulario de escaneo */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Scan className="w-5 h-5" />
                Código de Barras
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg font-mono"
                  placeholder="Escanee o ingrese el código..."
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium"
                >
                  {loading ? '🔍 Buscando...' : '🔍 Buscar'}
                </button>
                {(contenedorInfo || error) && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Información del contenedor */}
          {contenedorInfo && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-green-600 font-semibold text-lg">
                <CheckCircle className="w-6 h-6" />
                Contenedor encontrado
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Información del Contenedor</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><strong>Código:</strong> {contenedorInfo.codigo_barras}</p>
                    <p><strong>Tipo:</strong> {contenedorInfo.tipo}</p>
                    <p><strong>Dimensiones:</strong> {contenedorInfo.dimensiones}</p>
                    <p><strong>Peso:</strong> {contenedorInfo.peso} kg</p>
                    <p><strong>Buque:</strong> {contenedorInfo.buque_nombre}</p>
                  </div>
                </div>

                {contenedorInfo.cita_info && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">Información de la Reserva</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><strong>Cliente:</strong> {contenedorInfo.cita_info.cliente}</p>
                      <p><strong>Fecha Envío:</strong> {contenedorInfo.cita_info.fecha_envio}</p>
                      <p><strong>Fecha Recojo:</strong> {contenedorInfo.cita_info.fecha_recojo}</p>
                      <p>
                        <strong>Estado:</strong>{' '}
                        <span className={`px-2 py-1 rounded ${
                          contenedorInfo.cita_info.estado === 'reservada' ? 'bg-yellow-200 text-yellow-800' :
                          contenedorInfo.cita_info.estado === 'en_proceso' ? 'bg-blue-200 text-blue-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {contenedorInfo.cita_info.estado}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Asignación de ubicación */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">Asignar Ubicación</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Zona *</label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={selectedZona}
                      onChange={(e) => setSelectedZona(e.target.value)}
                    >
                      <option value="">Seleccionar zona</option>
                      {zonas.map((zona) => (
                        <option key={zona.id} value={zona.id}>
                          {zona.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Slot *</label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      disabled={!selectedZona}
                    >
                      <option value="">
                        {selectedZona ? 'Seleccionar slot' : 'Primero seleccione zona'}
                      </option>
                      {slots.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          Fila {slot.fila}, Col {slot.columna}, Nivel {slot.nivel}
                        </option>
                      ))}
                    </select>
                    {selectedZona && (
                      <p className="text-xs text-gray-500 mt-1">
                        {slots.length} slots disponibles
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleAssignSlot}
                  disabled={!selectedSlot || loading}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Creando ticket...' : '✓ Crear Ticket y Asignar Ubicación'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Instrucciones</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Escanee o ingrese el código de barras del contenedor</li>
            <li>El sistema buscará automáticamente la reserva asociada</li>
            <li>Verifique que las fechas sean correctas</li>
            <li>Seleccione una zona y un slot disponible</li>
            <li>Confirme para crear el ticket y asignar la ubicación</li>
          </ol>
        </div>
      </div>
    </OperatorLayout>
  );
};

export default ScanTicket;
