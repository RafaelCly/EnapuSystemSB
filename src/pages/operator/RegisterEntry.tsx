import { useState, useEffect } from "react";
import { LogIn, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import OperatorLayout from "@/components/OperatorLayout";
import { api } from "@/lib/api";

interface RegisterEntryProps {
  operatorName: string;
}

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
  placa?: string;
  conductor?: string;
  turno?: string;
}

const RegisterEntry = ({ operatorName }: RegisterEntryProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredTickets, setRegisteredTickets] = useState<number[]>([]);
  const [userName, setUserName] = useState("Operario");
  
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
    loadTickets();
  }, []);
  
  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await api.tickets.listWithDetails();
      // Filtrar tickets validados, en cola o activos (para pruebas)
      const validatedTickets = (data || []).filter((t: Ticket) => 
        t.estado === "Validado" || t.estado === "En Cola" || t.estado === "Activo"
      );
      setTickets(validatedTickets);
    } catch (error) {
      console.error('Error cargando tickets:', error);
      toast.error("Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterEntry = async (ticketId: number) => {
    try {
      // Actualizar estado del ticket a "En Proceso" o "Ingresado"
      await api.tickets.update(ticketId, { estado: 'Activo' });

      const now = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
      
      toast.success("Ingreso registrado", {
        description: `Vehículo ingresó al puerto a las ${now}`
      });

      setRegisteredTickets(prev => [...prev, ticketId]);
      
      // Recargar tickets
      await loadTickets();
    } catch (error) {
      console.error('Error registrando ingreso:', error);
      toast.error("Error al registrar ingreso");
    }
  };

  return (
    <OperatorLayout userName={userName}>
      <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Registrar Ingreso de Vehículos
          </CardTitle>
          <CardDescription>
            Tickets validados listos para ingresar al puerto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <LogIn className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay tickets validados pendientes de ingreso
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map((ticket) => {
                const isRegistered = registeredTickets.includes(ticket.id);
                const contenedor = ticket.contenedor_info;
                const ubicacion = ticket.ubicacion_info;
                const slotLabel = ubicacion 
                  ? `${ubicacion.zona_nombre || 'N/A'}-${ubicacion.fila || 0}${ubicacion.columna || 0}-${ubicacion.nivel || 0}`
                  : 'Sin asignar';
                
                return (
                  <Card key={ticket.id} className={isRegistered ? "opacity-60" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">Ticket #{ticket.id}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{contenedor?.codigo_contenedor || 'Sin contenedor'}</p>
                        </div>
                        <Badge className={
                          isRegistered 
                            ? "bg-green-500 text-white" 
                            : ticket.estado === "Validado" 
                              ? "bg-orange-500 text-white"
                              : "bg-yellow-500 text-white"
                        }>
                          {isRegistered ? "Ingresado" : ticket.estado}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contenedor:</span>
                          <span className="font-mono font-semibold">{contenedor?.codigo_contenedor || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="font-medium">{contenedor?.tipo || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Validado:</span>
                          <span className="font-medium">
                            {ticket.fecha_hora_entrada ? new Date(ticket.fecha_hora_entrada).toLocaleString('es-PE', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            }) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Slot:</span>
                          <Badge variant="outline">{slotLabel}</Badge>
                        </div>
                      </div>

                      {isRegistered ? (
                        <div className="flex items-center justify-center gap-2 p-3 bg-success/10 text-success rounded-lg">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Ingresado a las {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleRegisterEntry(ticket.id)}
                          className="w-full"
                          size="lg"
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          Registrar Ingreso
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

export default RegisterEntry;
