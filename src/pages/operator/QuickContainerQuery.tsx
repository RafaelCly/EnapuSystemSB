import { useState, useEffect } from "react";
import { Search, Package, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import OperatorLayout from "@/components/OperatorLayout";
import { apiFetch } from "@/lib/api";

interface Contenedor {
  id: number;
  codigo_barras: string;
  numero_contenedor: string;
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

interface ContainerInfo extends Contenedor {
  buque_nombre?: string;
  cita_info?: Record<string, unknown>;
  [key: string]: unknown;
}

const QuickContainerQuery = () => {
  const [containerId, setContainerId] = useState("");
  const [containerInfo, setContainerInfo] = useState<ContainerInfo | null>(null);
  const [userName, setUserName] = useState("Operario");
  const [contenedoresPendientes, setContenedoresPendientes] = useState<Contenedor[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
    loadContenedoresPendientes();
  }, []);

  const loadContenedoresPendientes = async () => {
    try {
      const [contenedores, tickets] = await Promise.all([
        apiFetch('/contenedores/'),
        apiFetch('/tickets/')
      ]);

      // Filtrar solo contenedores con cita y sin ticket
      const pendientes = contenedores.filter((c: Contenedor) => {
        const tieneTicket = tickets.some((t: Record<string, unknown>) => t.id_contenedor === c.id);
        return c.cita_info && !tieneTicket;
      });

      setContenedoresPendientes(pendientes);
    } catch (error) {
      console.error('Error cargando contenedores:', error);
    }
  };

  const handleSearch = async () => {
    if (!containerId.trim()) {
      toast.error("Por favor ingrese un código de barras");
      return;
    }

    setLoading(true);
    try {
      const contenedores = await apiFetch('/contenedores/');
      const container = contenedores.find((c: Contenedor) => 
        c.codigo_barras?.toLowerCase() === containerId.trim().toLowerCase()
      );

      if (!container) {
        toast.error("Contenedor no encontrado", {
          description: "No se encontró ningún contenedor con este código"
        });
        setContainerInfo(null);
        return;
      }

      // Verificar si tiene ticket
      const tickets = await apiFetch('/tickets/');
      const relatedTicket = tickets.find((t: Record<string, unknown>) => t.id_contenedor === container.id);

      setContainerInfo({ ...container, ticket: relatedTicket });
      toast.success("Contenedor encontrado");
    } catch (error) {
      console.error('Error buscando contenedor:', error);
      toast.error("Error al buscar contenedor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OperatorLayout userName={userName}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Consulta de Contenedores</h1>
        <p className="text-muted-foreground">Ver contenedores pendientes de validar y buscar por código de barras</p>
      </div>

      {/* Lista de contenedores pendientes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Contenedores Pendientes de Validar ({contenedoresPendientes.length})
          </CardTitle>
          <CardDescription>Contenedores con reserva confirmada que aún no han sido procesados</CardDescription>
        </CardHeader>
        <CardContent>
          {contenedoresPendientes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay contenedores pendientes de validar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Código Barras</th>
                    <th className="text-left p-3 font-semibold">Número</th>
                    <th className="text-left p-3 font-semibold">Cliente</th>
                    <th className="text-left p-3 font-semibold">Buque</th>
                    <th className="text-left p-3 font-semibold">Tipo</th>
                    <th className="text-left p-3 font-semibold">Fecha Recojo</th>
                    <th className="text-left p-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {contenedoresPendientes.map((cont) => (
                    <tr key={cont.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-mono text-sm">{cont.codigo_barras}</td>
                      <td className="p-3">{cont.numero_contenedor}</td>
                      <td className="p-3">{cont.cita_info?.cliente || '-'}</td>
                      <td className="p-3">{cont.buque_nombre}</td>
                      <td className="p-3">{cont.tipo}</td>
                      <td className="p-3">{cont.cita_info?.fecha_recojo || '-'}</td>
                      <td className="p-3">
                        <Badge className="bg-warning text-warning-foreground">
                          Pendiente
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Búsqueda */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Contenedor
          </CardTitle>
          <CardDescription>Busca información de cualquier contenedor por código de barras</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="containerInput">Código de Barras</Label>
            <Input
              id="containerInput"
              placeholder="Ej: CONT-2024-001"
              value={containerId}
              onChange={(e) => setContainerId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          
          <Button onClick={handleSearch} className="w-full" size="lg" disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Buscando...' : 'Buscar Contenedor'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Contenedor</CardTitle>
          <CardDescription>Detalles y ubicación actual</CardDescription>
        </CardHeader>
        <CardContent>
          {containerInfo ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <p className="text-sm font-medium text-muted-foreground mb-1">Código de Barras</p>
                <p className="text-lg font-bold font-mono">{containerInfo.codigo_barras}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Número:</span>
                  <span className="font-medium">{containerInfo.numero_contenedor}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <span className="font-medium">{containerInfo.tipo}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Dimensiones:</span>
                  <span className="font-medium">{containerInfo.dimensiones}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Peso:</span>
                  <span className="font-medium">{containerInfo.peso} kg</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Buque:</span>
                  <span className="font-medium">{containerInfo.buque_nombre}</span>
                </div>

                {containerInfo.cita_info && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Reserva Confirmada
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cliente:</span>
                        <span className="font-semibold">{containerInfo.cita_info.cliente}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha Envío:</span>
                        <span>{containerInfo.cita_info.fecha_envio || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha Recojo:</span>
                        <span>{containerInfo.cita_info.fecha_recojo || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estado:</span>
                        <Badge variant="outline">{containerInfo.cita_info.estado}</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {!containerInfo.cita_info && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium mb-2 flex items-center gap-2 text-red-700">
                      <XCircle className="h-4 w-4" />
                      Sin Reserva
                    </p>
                    <p className="text-xs text-red-600">Este contenedor no tiene una cita/reserva asociada</p>
                  </div>
                )}

                {containerInfo.ticket && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium mb-2 flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      Ya Validado
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ticket:</span>
                        <span className="font-semibold">#{containerInfo.ticket.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estado:</span>
                        <Badge variant="outline">{containerInfo.ticket.estado}</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {!containerInfo.ticket && containerInfo.cita_info && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium flex items-center gap-2 text-yellow-700">
                      <Clock className="h-4 w-4" />
                      Pendiente de Validar
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">Este contenedor puede ser validado</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Ingresa un ID de contenedor para ver su información
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </OperatorLayout>
  );
};

export default QuickContainerQuery;
