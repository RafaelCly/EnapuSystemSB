import { useState, useEffect } from "react";
import { Monitor, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OperatorLayout from "@/components/OperatorLayout";
import { api } from "@/lib/api";

interface Ticket {
  id: number;
  estado: string;
  fecha_hora_entrada: string;
  fecha_hora_salida: string | null;
  id_contenedor: number;
  id_ubicacion: number;
  contenedor_info?: {
    codigo_contenedor?: string;
    tipo?: string;
  } | null;
  ubicacion_info?: {
    zona_nombre?: string;
    fila?: number;
    columna?: number;
    nivel?: number;
  } | null;
}

const TurnMonitor = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [monitorTickets, setMonitorTickets] = useState<Ticket[]>([]);
  const [userName, setUserName] = useState("Operario");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
    
    // Cargar tickets inicialmente
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await api.tickets.listWithDetails();
      setMonitorTickets(data || []);
    } catch (error) {
      console.error('Error cargando tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-actualizar tickets cada 8 segundos
  useEffect(() => {
    const autoRefresh = setInterval(() => {
      loadTickets();
    }, 8000);

    return () => clearInterval(autoRefresh);
  }, []);

  const handleRefresh = () => {
    loadTickets();
  };

  const getStatusColor = (estado: string) => {
    const colors: Record<string, string> = {
      "Activo": "bg-green-500 text-white",
      "Finalizado": "bg-blue-600 text-white",
      "Cancelado": "bg-red-500 text-white",
      "Validado": "bg-orange-500 text-white"
    };
    return colors[estado] || "bg-gray-400 text-white";
  };

  // Mostrar tickets activos (no finalizados ni cancelados)
  const activeTickets = monitorTickets.filter(t => 
    t.estado === "Activo" || t.estado === "Validado"
  );

  return (
    <OperatorLayout userName={userName}>
      <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 animate-pulse" />
                Monitor de Turnos en Tiempo Real
              </CardTitle>
              <CardDescription>
                Actualización automática cada 8 segundos - {currentTime.toLocaleTimeString('es-PE')}
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Monitor className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
              <p className="text-muted-foreground">Cargando tickets...</p>
            </div>
          ) : activeTickets.length === 0 ? (
            <div className="text-center py-12">
              <Monitor className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay tickets activos en este momento
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTickets.map((ticket, index) => {
                const contenedor = ticket.contenedor_info;
                const ubicacion = ticket.ubicacion_info;
                const slotLabel = ubicacion 
                  ? `${ubicacion.zona_nombre || 'N/A'}-${String(ubicacion.fila || 0).padStart(2, '0')}-${String(ubicacion.columna || 0).padStart(2, '0')}`
                  : 'Sin asignar';
                const fechaEntrada = ticket.fecha_hora_entrada ? new Date(ticket.fecha_hora_entrada) : null;
                
                return (
                  <div 
                    key={ticket.id} 
                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Ticket</p>
                        <p className="font-semibold">#{ticket.id}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Contenedor</p>
                        <p className="font-mono text-sm">{contenedor?.codigo_contenedor || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Tipo</p>
                        <p className="font-semibold">{contenedor?.tipo || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Turno</p>
                        <p className="text-sm font-medium">
                          {fechaEntrada ? fechaEntrada.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Slot</p>
                        <Badge variant="outline">{slotLabel}</Badge>
                      </div>
                      
                      <div className="flex justify-end">
                        <Badge className={getStatusColor(ticket.estado)}>
                          {ticket.estado}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas de tickets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{monitorTickets.filter(t => t.estado === "Activo").length}</p>
            <p className="text-sm text-muted-foreground">Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{monitorTickets.filter(t => t.estado === "Validado").length}</p>
            <p className="text-sm text-muted-foreground">Validados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{monitorTickets.filter(t => t.estado === "Finalizado").length}</p>
            <p className="text-sm text-muted-foreground">Finalizados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{monitorTickets.filter(t => t.estado === "Cancelado").length}</p>
            <p className="text-sm text-muted-foreground">Cancelados</p>
          </CardContent>
        </Card>
      </div>
      </div>
    </OperatorLayout>
  );
};

export default TurnMonitor;
