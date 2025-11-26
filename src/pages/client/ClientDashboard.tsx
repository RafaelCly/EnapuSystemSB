import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus, List, History, Truck, Bell, User as UserIcon, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CardStat from "@/components/CardStat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

interface Ticket {
  id: number;
  estado: string;
  fecha_hora_entrada?: string;
  contenedor_info?: {
    codigo_contenedor?: string;
    tipo?: string;
  } | null;
  ubicacion_info?: {
    zona_nombre?: string;
  } | null;
  [key: string]: unknown;
}

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    
    if (!storedUserId || storedRole?.toUpperCase() !== "CLIENTE") {
      navigate("/");
      return;
    }
    
    setUserId(storedUserId);
    setUser({
      id: parseInt(storedUserId),
      name: storedName || 'Cliente',
      email: storedEmail || '',
      role: storedRole
    });
  }, [navigate]);

  // Cargar tickets del cliente (a través de sus contenedores)
  useEffect(() => {
    const loadUserTickets = async () => {
      if (!user?.id) {
        console.log('No hay usuario o ID:', user);
        return;
      }
      
      try {
        setLoading(true);
        console.log('Cargando tickets para cliente ID:', user.id);
        // Usar byCliente que busca tickets por contenedores del cliente
        const tickets = await api.tickets.byCliente(user.id as number);
        console.log('Tickets cargados:', tickets);
        console.log('Número de tickets:', tickets?.length || 0);
        setUserTickets(tickets || []);
      } catch (error) {
        console.error('Error cargando tickets:', error);
        setUserTickets([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserTickets();
  }, [user]);

  if (!user) return null;

  const activeTickets = userTickets.filter(t => 
    ["Activo", "Validado"].includes(t.estado)
  );
  const completedTickets = userTickets.filter(t => 
    t.estado === "Finalizado"
  );
  const nextTurno = userTickets.find(t => t.estado === "Activo");

  const sidebarItems = [
    { name: "Dashboard", path: "/client/dashboard", icon: LayoutGrid },
    { name: "Mis Reservas", path: "/client/my-tickets", icon: List },
    { name: "Historial", path: "/client/history", icon: History },
    { name: "Gestión de Flota", path: "/client/fleet", icon: Truck },
    //{ name: "Notificaciones", path: "/client/notifications", icon: Bell },
    //{ name: "Perfil", path: "/client/profile", icon: UserIcon },
  ];

  const quickActions = [
    {
      title: "Ver Mis Reservas",
      description: "Consulta el estado de tus reservas y tickets",
      icon: List,
      action: () => navigate("/client/my-tickets"),
      color: "bg-primary text-primary-foreground hover:bg-primary/90"
    },
    {
      title: "Historial",
      description: "Revisa el historial completo de operaciones",
      icon: History,
      action: () => navigate("/client/history"),
      color: "bg-accent text-accent-foreground hover:bg-accent/90"
    },
    {
      title: "Gestionar Flota",
      description: "Administra tus vehículos y conductores",
      icon: Truck,
      action: () => navigate("/client/fleet"),
      color: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="CLIENTE" userName={user.name} notifications={0} />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bienvenido, {user.name}
            </h1>
            <p className="text-muted-foreground">
              Panel de control de gestión de tickets
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <CardStat
              title="Tickets Activos"
              value={loading ? "..." : activeTickets.length}
              icon={LayoutGrid}
              trend="+2 este mes"
              variant="default"
            />
            <CardStat
              title="Próximo Turno"
              value={loading ? "..." : (nextTurno ? "Pendiente" : "--:--")}
              icon={Bell}
              trend={nextTurno ? `Ticket #${nextTurno.id}` : "Sin turnos"}
              variant="warning"
            />
            <CardStat
              title="Completados"
              value={loading ? "..." : completedTickets.length}
              icon={History}
              trend="Esta semana"
              variant="success"
            />
            <CardStat
              title="Notificaciones"
              value="0"
              icon={Bell}
              trend="Sin leer"
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

          {/* Recent Tickets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Tickets Recientes</h2>
              <Button variant="outline" onClick={() => navigate("/client/my-tickets")}>
                Ver Todos
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-full text-center text-muted-foreground">
                  Cargando tickets...
                </div>
              ) : userTickets.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground">
                  No hay tickets disponibles
                </div>
              ) : (
                userTickets.slice(0, 4).map((ticket) => (
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
                          ticket.estado === "Validado" ? "bg-blue-100 text-blue-800" :
                          ticket.estado === "Cancelado" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {ticket.estado?.toUpperCase() || 'N/A'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contenedor:</span>
                          <span className="font-medium font-mono">
                            {ticket.contenedor_info?.codigo_contenedor || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="font-medium">
                            {ticket.contenedor_info?.tipo || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entrada:</span>
                          <span className="font-medium">
                            {ticket.fecha_hora_entrada ? 
                              new Date(ticket.fecha_hora_entrada).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ubicación:</span>
                          <span className="font-medium">
                            {ticket.ubicacion_info?.zona_nombre ? 
                              `Zona ${ticket.ubicacion_info.zona_nombre}` : 'Sin asignar'}
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

export default ClientDashboard;
