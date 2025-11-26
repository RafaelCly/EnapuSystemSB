import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  Monitor, 
  Search 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CardStat from "@/components/CardStat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

interface Ticket {
  id: number;
  estado: string;
  fecha_hora_entrada: string;
  fecha_hora_salida?: string;
  observaciones?: string;
  contenedor_info?: {
    codigo_contenedor?: string;
    tipo?: string;
    peso?: number;
  } | null;
  ubicacion_info?: {
    zona_nombre?: string;
    fila?: number;
    columna?: number;
    nivel?: number;
  } | null;
}

const OperatorPanel = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Operario");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activos: 0,
    finalizados: 0,
    total: 0,
    finalizadosHoy: 0
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    const storedName = localStorage.getItem("userName");
    
    if (!storedUserId || storedRole?.toUpperCase() !== "OPERARIO") {
      navigate("/");
      return;
    }
    
    setUserId(storedUserId);
    if (storedName) {
      setUserName(storedName);
    }
  }, [navigate]);

  // Cargar tickets del operario
  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        // Cargar tickets procesados por este operario
        const ticketsData = await api.tickets.byUsuario(parseInt(userId));
        setTickets(ticketsData || []);
        
        // Calcular estadísticas
        const today = new Date().toISOString().split('T')[0];
        const activos = ticketsData?.filter((t: Ticket) => t.estado === 'Activo').length || 0;
        const finalizados = ticketsData?.filter((t: Ticket) => t.estado === 'Finalizado').length || 0;
        const finalizadosHoy = ticketsData?.filter((t: Ticket) => 
          t.estado === 'Finalizado' && 
          t.fecha_hora_salida?.startsWith(today)
        ).length || 0;
        
        setStats({
          activos,
          finalizados,
          total: ticketsData?.length || 0,
          finalizadosHoy
        });
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  if (!userId) return null;

  const sidebarItems = [
    { name: "Panel de Operaciones", path: "/operator/panel", icon: LayoutDashboard },
    { name: "Validar Contenedor", path: "/operator/scan", icon: CheckCircle2 },
    { name: "Ingreso", path: "/operator/entry", icon: LogIn },
    { name: "Salida", path: "/operator/exit", icon: LogOut },
    { name: "Monitor", path: "/operator/monitor", icon: Monitor },
    { name: "Consulta", path: "/operator/query", icon: Search },
  ];

  const quickActions = [
    {
      title: "Validar Tickets",
      description: "Gestiona la validación de tickets pendientes",
      icon: CheckCircle2,
      action: () => navigate("/operator/validate"),
      color: "bg-primary text-primary-foreground hover:bg-primary-light"
    },
    {
      title: "Registrar Ingreso",
      description: "Registra el ingreso de contenedores",
      icon: LogIn,
      action: () => navigate("/operator/entry"),
      color: "bg-accent text-accent-foreground hover:bg-accent/90"
    },
    {
      title: "Registrar Salida",
      description: "Registra la salida de contenedores",
      icon: LogOut,
      action: () => navigate("/operator/exit"),
      color: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    },
    {
      title: "Monitorear",
      description: "Monitorea el flujo de contenedores",
      icon: Monitor,
      action: () => navigate("/operator/monitor"),
      color: "bg-success text-success-foreground hover:bg-success/90"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="OPERARIO" userName={userName} />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Operaciones</h1>
            <p className="text-muted-foreground">Gestiona tickets, registros y monitorea el flujo del puerto</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <CardStat
              title="Tickets Activos"
              value={loading ? "..." : stats.activos}
              icon={CheckCircle2}
              trend="Pendientes"
              variant="warning"
            />
            <CardStat
              title="Total Procesados"
              value={loading ? "..." : stats.total}
              icon={Monitor}
              trend="Todos"
              variant="default"
            />
            <CardStat
              title="Finalizados"
              value={loading ? "..." : stats.finalizados}
              icon={LogOut}
              trend="Completados"
              variant="success"
            />
            <CardStat
              title="Finalizados Hoy"
              value={loading ? "..." : stats.finalizadosHoy}
              icon={CheckCircle2}
              trend="Hoy"
              variant="destructive"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={action.action}
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription className="text-sm">{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Ingress */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Tickets Recientes</h2>
              <Button variant="outline" onClick={() => navigate("/operator/entry")}>
                Ver Todos
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  Cargando tickets...
                </div>
              ) : tickets.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  No hay tickets asignados
                </div>
              ) : (
                tickets.slice(0, 4).map((ticket) => (
                  <Card key={ticket.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">Ticket #{ticket.id}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {ticket.contenedor_info?.codigo_contenedor || 'Sin contenedor'}
                          </CardDescription>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ticket.estado === "Finalizado" ? "bg-green-100 text-green-800" :
                          ticket.estado === "Activo" ? "bg-yellow-100 text-yellow-800" :
                          ticket.estado === "Cancelado" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {ticket.estado}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="font-medium">{ticket.contenedor_info?.tipo || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Peso:</span>
                          <span className="font-medium">
                            {ticket.contenedor_info?.peso ? `${ticket.contenedor_info.peso.toLocaleString()} kg` : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entrada:</span>
                          <span className="font-medium">
                            {ticket.fecha_hora_entrada ? 
                              new Date(ticket.fecha_hora_entrada).toLocaleString() : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ubicación:</span>
                          <span className="font-medium">
                            {ticket.ubicacion_info ? 
                              `${ticket.ubicacion_info.zona_nombre || 'Zona'} F${ticket.ubicacion_info.fila}-C${ticket.ubicacion_info.columna}` 
                              : 'Sin asignar'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OperatorPanel;
