import React, { useState, useEffect, useCallback } from 'react';
import OperatorLayout from '../../components/OperatorLayout';
import { api } from '../../lib/api';
import { Scan, Package, MapPin, User, CheckCircle, X } from 'lucide-react';

interface ContenedorInfo {
  id: number;
  codigo_contenedor: string;
  tipo: string;
  peso: number;
  dimensiones: string;
  id_buque?: number;
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
  const [codigoContenedor, setCodigoContenedor] = useState('');
  const [contenedorInfo, setContenedorInfo] = useState<ContenedorInfo | null>(null);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedZona, setSelectedZona] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [userName, setUserName] = useState("Operario");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  const loadZonas = useCallback(async () => {
    try {
      const zonasData = await api.zonas.list();
      setZonas(zonasData || []);
    } catch (err) {
      console.error('Error cargando zonas:', err);
    }
  }, []);

  const loadSlotsByZona = useCallback(async (zonaId: number) => {
    try {
      const slotsData = await api.slots.list();
      const slotsDisponibles = (slotsData || []).filter(
        (s: Slot) => s.id_zona === zonaId && (s.estado === 'Vacio' || s.estado.toLowerCase() === 'disponible')
      );
      
      const zona = zonas.find(z => z.id === zonaId);
      const slotsConZona = slotsDisponibles.map((s: Slot) => ({
        ...s,
        zona_nombre: zona?.nombre || ''
      }));
      
      setSlots(slotsConZona);
    } catch (err) {
      console.error('Error cargando slots:', err);
    }
  }, [zonas]);

  useEffect(() => {
    loadZonas();
  }, [loadZonas]);

  useEffect(() => {
    if (selectedZona) {
      loadSlotsByZona(Number(selectedZona));
    } else {
      setSlots([]);
      setSelectedSlot('');
    }
  }, [selectedZona, loadSlotsByZona]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigoContenedor.trim()) {
      setError('Por favor ingrese un código de contenedor');
      return;
    }

    setLoading(true);
    setError('');
    setContenedorInfo(null);

    try {
      // Buscar contenedor por código
      const contenedores = await api.contenedores.list();
      const contenedor = (contenedores || []).find(
        (c: ContenedorInfo) => c.codigo_contenedor?.toUpperCase() === codigoContenedor.trim().toUpperCase()
      );

      if (!contenedor) {
        setError('❌ Contenedor no encontrado. Verifique el código.');
        return;
      }

      // Verificar que el contenedor no tenga ticket ya creado
      const tickets = await api.tickets.list();
      const ticketExistente = (tickets || []).find((t: Record<string, unknown>) => t.id_contenedor === contenedor.id);
      
      if (ticketExistente) {
        setError(`❌ Este contenedor ya fue procesado. Ticket #${ticketExistente.id} (Estado: ${ticketExistente.estado}).`);
        return;
      }

      setContenedorInfo(contenedor);
    } catch (err: unknown) {
      console.error('Error buscando contenedor:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
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
      // Obtener el usuario actual (operario)
      const userId = localStorage.getItem('userId');

      // Crear el ticket
      const ticketPayload = {
        fecha_hora_entrada: new Date().toISOString(),
        estado: 'Validado' as const,
        id_ubicacion: Number(selectedSlot),
        id_usuario: Number(userId),
        id_contenedor: contenedorInfo.id
      };

      await api.tickets.create(ticketPayload);

      // Actualizar estado del slot a ocupado
      await api.slots.update(Number(selectedSlot), { estado: 'Ocupado' });

      alert('✅ Ticket creado exitosamente! El contenedor ha sido asignado.');
      
      // Reset form
      setCodigoContenedor('');
      setContenedorInfo(null);
      setSelectedZona('');
      setSelectedSlot('');
      setError('');
    } catch (err: unknown) {
      console.error('Error creando ticket:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el ticket';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCodigoContenedor('');
    setContenedorInfo(null);
    setSelectedZona('');
    setSelectedSlot('');
    setError('');
  };

  return (
    <OperatorLayout userName={userName}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Validar Contenedor</h1>
          <p className="text-muted-foreground">
            Busque el contenedor por código para validarlo y asignar ubicación
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Scan className="w-5 h-5" />
                Código de Contenedor
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg font-mono"
                  placeholder="Ej: MSCU1234567, EISU9998877..."
                  value={codigoContenedor}
                  onChange={(e) => setCodigoContenedor(e.target.value.toUpperCase())}
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
                    <p><strong>Código:</strong> <span className="font-mono">{contenedorInfo.codigo_contenedor}</span></p>
                    <p><strong>Tipo:</strong> {contenedorInfo.tipo}</p>
                    <p><strong>Dimensiones:</strong> {contenedorInfo.dimensiones}</p>
                    <p><strong>Peso:</strong> {contenedorInfo.peso?.toLocaleString()} kg</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Estado</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-green-700 font-medium">✓ Listo para asignar ubicación</p>
                  </div>
                </div>
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
            <li>Ingrese el código del contenedor (ej: MSCU1234567)</li>
            <li>El sistema buscará el contenedor en la base de datos</li>
            <li>Verifique la información del contenedor</li>
            <li>Seleccione una zona y un slot disponible</li>
            <li>Confirme para crear el ticket y asignar la ubicación</li>
          </ol>
        </div>
      </div>
    </OperatorLayout>
  );
};

export default ScanTicket;
