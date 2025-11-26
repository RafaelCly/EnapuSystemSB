import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus, List, History, Truck, Bell, User as UserIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface User {
  id: number;
  name: string;
  [key: string]: unknown;
}

interface Ticket {
  id: number;
  estado: string;
  fecha_creacion: string;
  contenedor_info?: Record<string, unknown>;
  [key: string]: unknown;
}

const MyTickets = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    const storedName = localStorage.getItem("userName");
    
    if (!storedUserId || storedRole !== "CLIENTE") {
      navigate("/");
      return;
    }
    
    setUserId(storedUserId);
    setUser({
      id: parseInt(storedUserId),
      name: storedName || 'Cliente'
    });
  }, [navigate]);

  // Cargar tickets del usuario
  useEffect(() => {
    const loadUserTickets = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const tickets = await api.tickets.byUsuario(user.id);
        console.log('Tickets cargados en MyTickets:', tickets);
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

  const columns = [
    { key: "id", label: "ID" },
    { 
      key: "contenedor_info", 
      label: "Contenedor",
      render: (value: unknown) => {
        const info = value as Record<string, unknown> | undefined;
        return (
          <span className="font-mono text-sm">
            {(info?.codigo_barras as string) || (info?.numero_contenedor as string) || 'N/A'}
          </span>
        );
      }
    },
    { 
      key: "contenedor_info", 
      label: "Tipo",
      render: (value: unknown) => {
        const info = value as Record<string, unknown> | undefined;
        return (info?.tipo as string) || 'N/A';
      }
    },
    { 
      key: "ubicacion_info", 
      label: "Ubicación",
      render: (value: unknown) => {
        const info = value as Record<string, unknown> | undefined;
        return info ? `Zona ${info.zona_nombre as string}` : 'Sin asignar';
      }
    },
    { 
      key: "estado", 
      label: "Estado",
      render: (value: string) => {
        const variants: Record<string, string> = {
          "pendiente": "bg-blue-100 text-blue-800",
          "en_proceso": "bg-yellow-100 text-yellow-800",
          "en_espera": "bg-gray-100 text-gray-800",
          "completado": "bg-green-100 text-green-800",
          "cancelado": "bg-red-100 text-red-800"
        };
        return (
          <Badge className={variants[value?.toLowerCase()] || "bg-gray-100 text-gray-600"}>
            {value?.replace('_', ' ').toUpperCase() || 'N/A'}
          </Badge>
        );
      }
    },
    { 
      key: "fecha_hora_entrada", 
      label: "Fecha Entrada",
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    { 
      key: "fecha_hora_salida", 
      label: "Fecha Salida",
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Pendiente'
    },
  ];

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
            <h1 className="text-3xl font-bold text-foreground mb-2">Mis Tickets</h1>
            <p className="text-muted-foreground">Consulta y gestiona todos tus tickets</p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando tickets...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={userTickets}
              searchKeys={["estado"]}
              itemsPerPage={10}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default MyTickets;
