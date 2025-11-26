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
import { tickets, users } from "@/data/mocks";

const OperatorPanel = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Operario");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    const storedName = localStorage.getItem("userName");
    
    if (!storedUserId || storedRole !== "OPERARIO") {
      navigate("/");
      return;
    }
    
    setUserId(storedUserId);
    if (storedName) {
      setUserName(storedName);
    }
  }, [navigate]);

  if (!userId) return null;

  const pendingTickets = tickets.filter(t => t.estado === "Pendiente").length;
  const inProcessTickets = tickets.filter(t => t.estado === "En Proceso").length;
  const completedToday = tickets.filter(t => t.estado === "Completado" && t.fecha === new Date().toISOString().split('T')[0]).length;
  const inQueueTickets = tickets.filter(t => t.estado === "En Cola").length;

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
              title="Tickets Pendientes"
              value={pendingTickets}
              icon={CheckCircle2}
              trend="Este mes"
              variant="warning"
            />
            <CardStat
              title="En Proceso"
              value={inProcessTickets}
              icon={Monitor}
              trend="En curso"
              variant="default"
            />
            <CardStat
              title="En Cola"
              value={inQueueTickets}
              icon={LogIn}
              trend="A la espera"
              variant="destructive"
            />
            <CardStat
              title="Completados Hoy"
              value={completedToday}
              icon={CheckCircle2}
              trend="Hoy"
              variant="success"
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
              <h2 className="text-xl font-semibold">Ingresos Recientes</h2>
              <Button variant="outline" onClick={() => navigate("/operator/entry")}>
                Ver Todos
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {tickets.slice(0, 4).map((ticket) => (
                <Card key={ticket.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">Ticket #{ticket.id}</CardTitle>
                        <CardDescription className="text-sm mt-1">{ticket.contenedorId}</CardDescription>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.estado === "Completado" ? "bg-success text-success-foreground" :
                        ticket.estado === "En Proceso" ? "bg-warning text-warning-foreground" :
                        ticket.estado === "Pendiente" ? "bg-accent text-accent-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {ticket.estado}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transportista:</span>
                        <span className="font-medium">{ticket.transportista}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Placa:</span>
                        <span className="font-medium">{ticket.placa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Turno:</span>
                        <span className="font-medium">{ticket.turno}</span>
                      </div>
                      {ticket.slot && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Slot:</span>
                          <span className="font-medium">{ticket.slot}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OperatorPanel;
