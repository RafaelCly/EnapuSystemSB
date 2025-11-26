import { useState, useEffect } from "react";
import { LogOut, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import OperatorLayout from "@/components/OperatorLayout";
import { apiFetch } from "@/lib/api";

interface RegisterExitProps {
  operatorName: string;
}

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

const RegisterExit = ({ operatorName }: RegisterExitProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [exitedTickets, setExitedTickets] = useState<number[]>([]);
  const [userName, setUserName] = useState("Operario");
  
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
    loadTickets();
  }, []);
  
  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/tickets/');
      // Filtrar tickets completados o en proceso (listos para salir)
      const completedTickets = data.filter((t: Ticket) => 
        t.estado === "Completado" || t.estado === "En Proceso"
      );
      setTickets(completedTickets);
    } catch (error) {
      console.error('Error cargando tickets:', error);
      toast.error("Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterExit = async (ticketId: number) => {
    try {
      // Actualizar estado del ticket a "Completado" y registrar fecha de salida
      await apiFetch(`/tickets/${ticketId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          estado: 'Completado',
          fecha_hora_salida: new Date().toISOString()
        })
      });

      const now = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
      
      toast.success("Salida registrada", {
        description: `Vehículo salió del puerto a las ${now}`
      });

      setExitedTickets(prev => [...prev, ticketId]);
      
      // Recargar tickets
      await loadTickets();
    } catch (error) {
      console.error('Error registrando salida:', error);
      toast.error("Error al registrar salida");
    }
  };

  return (
    <OperatorLayout userName={userName}>
      <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Registrar Salida de Vehículos
          </CardTitle>
          <CardDescription>
            Tickets completados listos para salir del puerto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <LogOut className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay tickets completados pendientes de salida
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map((ticket) => {
                const hasExited = exitedTickets.includes(ticket.id);
                const slotLabel = `${ticket.ubicacion_info.zona_nombre}-${String(ticket.ubicacion_info.fila).padStart(2, '0')}-${String(ticket.ubicacion_info.columna).padStart(2, '0')}`;
                
                return (
                  <Card key={ticket.id} className={hasExited ? "opacity-60" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">Ticket #{ticket.id}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{ticket.contenedor_info.codigo_barras}</p>
                        </div>
                        <Badge className={
                          hasExited 
                            ? "bg-gray-400 text-white" 
                            : ticket.estado === "Completado"
                              ? "bg-green-600 text-white"
                              : "bg-orange-500 text-white"
                        }>
                          {hasExited ? "Retirado" : ticket.estado}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contenedor:</span>
                          <span className="font-mono font-semibold">{ticket.contenedor_info.codigo_barras}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="font-medium">{ticket.contenedor_info.tipo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entrada:</span>
                          <span className="font-medium text-xs">
                            {new Date(ticket.fecha_hora_entrada).toLocaleString('es-PE', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Slot:</span>
                          <Badge variant="outline">{slotLabel}</Badge>
                        </div>
                      </div>

                      {hasExited ? (
                        <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Salida a las {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleRegisterExit(ticket.id)}
                          className="w-full"
                          size="lg"
                          variant="destructive"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Registrar Salida
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </OperatorLayout>
  );
};

export default RegisterExit;
