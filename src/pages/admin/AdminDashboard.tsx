import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import CardStat from "@/components/CardStat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Grid3x3, Package, Settings, BarChart3, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [stats, setStats] = useState({
    totalTickets: 0,
    activeTickets: 0,
    totalUsers: 0,
    availableSlots: 0
  });

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    setUserName(storedName || "Administrador");

    // Cargar estadísticas desde la API
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [tickets, usuarios, slots] = await Promise.all([
        api.tickets.list(),
        api.usuarios.list(),
        api.slots.list()
      ]);
      
      setStats({
        totalTickets: tickets?.length || 0,
        activeTickets: tickets?.filter((t: any) => t.estado === 'Activo').length || 0,
        totalUsers: usuarios?.length || 0,
        availableSlots: slots?.filter((s: any) => s.estado === 'Vacio').length || 0
      });
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  const { totalTickets, activeTickets, totalUsers, availableSlots } = stats;

  const quickLinks = [
    { title: "Gestión de Usuarios", path: "/admin/users", icon: Users, description: "Ver usuarios del sistema" },
    { title: "Zonas", path: "/admin/zonas", icon: MapPin, description: "Gestionar zonas del puerto" },
    { title: "Slots", path: "/admin/slots", icon: Grid3x3, description: "Gestionar ubicaciones" },
    { title: "Contenedores", path: "/admin/contenedores", icon: Package, description: "Gestionar contenedores" },
    { title: "Configuración", path: "/admin/config", icon: Settings, description: "Configuración del sistema" },
    { title: "Reportes", path: "/admin/reports", icon: BarChart3, description: "Analítica y reportes" },
    { title: "Monitor", path: "/admin/monitor", icon: Activity, description: "Logs del sistema" },
  ];

  return (
    <AdminLayout userName={userName}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Administración</h1>
        <p className="text-muted-foreground">Vista general del sistema ENAPU</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <CardStat title="Total Tickets" value={totalTickets} icon={Package} variant="default" />
        <CardStat title="Tickets Activos" value={activeTickets} icon={Activity} variant="warning" />
        <CardStat title="Usuarios Registrados" value={totalUsers} icon={Users} variant="success" />
        <CardStat title="Slots Disponibles" value={availableSlots} icon={Grid3x3} variant="destructive" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Card key={link.path} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate(link.path)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{link.title}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
