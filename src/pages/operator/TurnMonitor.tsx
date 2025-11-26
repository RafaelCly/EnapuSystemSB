import { useState, useEffect } from "react";
import { Monitor, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OperatorLayout from "@/components/OperatorLayout";
import { apiFetch } from "@/lib/api";

interface Ticket {
  id: number;
  estado: string;
  fecha_hora_entrada: string;
  fecha_hora_salida: string | null;
  contenedor_info: {
    codigo_barras: string;
    tipo: string;
  };
  ubicacion_info: {
    zona_nombre: string;
    fila: number;
    columna: number;
    nivel: number;
  };
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
      const data = await apiFetch('/tickets/');
      setMonitorTickets(data);
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
      "Pendiente": "bg-blue-500 text-white",
      "En Cola": "bg-gray-500 text-white",
      "Validado": "bg-blue-600 text-white",
      "En Proceso": "bg-orange-500 text-white",
      "Completado": "bg-green-600 text-white",
      "Retirado": "bg-green-700 text-white"
    };
    return colors[estado] || "bg-gray-400 text-white";
  };

  const activeTickets = monitorTickets.filter(t => 
    ["Pendiente", "En Cola", "Validado", "En Proceso"].includes(t.estado)
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
                const slotLabel = `${ticket.ubicacion_info.zona_nombre}-${String(ticket.ubicacion_info.fila).padStart(2, '0')}-${String(ticket.ubicacion_info.columna).padStart(2, '0')}`;
                const fechaEntrada = new Date(ticket.fecha_hora_entrada);
                
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
                        <p className="font-mono text-sm">{ticket.contenedor_info.codigo_barras}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Tipo</p>
                        <p className="font-semibold">{ticket.contenedor_info.tipo}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Turno</p>
                        <p className="text-sm font-medium">
                          {fechaEntrada.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{monitorTickets.filter(t => t.estado === "Pendiente").length}</p>
            <p className="text-sm text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-500">{monitorTickets.filter(t => t.estado === "En Cola").length}</p>
            <p className="text-sm text-muted-foreground">En Cola</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{monitorTickets.filter(t => t.estado === "Validado").length}</p>
            <p className="text-sm text-muted-foreground">Validados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{monitorTickets.filter(t => t.estado === "En Proceso").length}</p>
            <p className="text-sm text-muted-foreground">En Proceso</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{monitorTickets.filter(t => t.estado === "Completado").length}</p>
            <p className="text-sm text-muted-foreground">Completados</p>
          </CardContent>
        </Card>
      </div>
      </div>
    </OperatorLayout>
  );
};

export default TurnMonitor;
