import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus, List, History, Truck, Bell, User as UserIcon, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notifications, users } from "@/data/mocks";

const Notifications = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    
    if (!storedUserId || storedRole?.toUpperCase() !== "CLIENTE") {
      navigate("/");
      return;
    }
    
    setUserId(storedUserId);
    const foundUser = users.find(u => u.id === parseInt(storedUserId));
    setUser(foundUser);
  }, [navigate]);

  if (!user) return null;

  const userNotifications = notifications.filter(n => n.userId === user.id);

  const getIcon = (tipo: string) => {
    if (tipo === "success") return CheckCircle2;
    if (tipo === "warning") return AlertTriangle;
    return Info;
  };

  const getIconColor = (tipo: string) => {
    if (tipo === "success") return "text-success";
    if (tipo === "warning") return "text-warning";
    return "text-accent";
  };

  const sidebarItems = [
    { name: "Dashboard", path: "/client/dashboard", icon: LayoutGrid },
    { name: "Mis Tickets", path: "/client/my-tickets", icon: List },
    { name: "Historial", path: "/client/history", icon: History },
    { name: "Gestión de Flota", path: "/client/fleet", icon: Truck },
    //{ name: "Notificaciones", path: "/client/notifications", icon: Bell },
    //{ name: "Perfil", path: "/client/profile", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="CLIENTE" userName={user.name} />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Notificaciones</h1>
            <p className="text-muted-foreground">Mantente informado sobre el estado de tus tickets</p>
          </div>

          <div className="space-y-4 max-w-3xl">
            {userNotifications.map((notification) => {
              const Icon = getIcon(notification.tipo);
              return (
                <Card key={notification.id} className={notification.leido ? "opacity-60" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-muted ${getIconColor(notification.tipo)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold mb-1">{notification.titulo}</CardTitle>
                          <p className="text-sm text-muted-foreground">{notification.mensaje}</p>
                        </div>
                      </div>
                      {!notification.leido && (
                        <Badge variant="destructive">Nuevo</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{notification.fecha}</p>
                  </CardContent>
                </Card>
              );
            })}

            {userNotifications.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tienes notificaciones</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
