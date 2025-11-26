import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus, List, History as HistoryIcon, Truck, Bell, User as UserIcon } from "lucide-react";
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

interface ContenedorInfo {
  codigo_barras?: string;
  numero_contenedor?: string;
  tipo?: string;
  [key: string]: unknown;
}

interface UbicacionInfo {
  zona_nombre?: string;
  [key: string]: unknown;
}

interface HistoryTicket {
  id: number;
  contenedor_info?: ContenedorInfo;
  ubicacion_info?: UbicacionInfo;
  estado?: string;
  fecha_hora_entrada?: string;
  fecha_hora_salida?: string;
  [key: string]: unknown;
}

const History = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userTicketsHistory, setUserTicketsHistory] = useState<HistoryTicket[]>([]);
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

  // Cargar historial de tickets del usuario
  useEffect(() => {
    const loadUserTicketsHistory = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const tickets = await api.tickets.byUsuario(user.id);
        // Filtrar solo tickets completados o con fecha de salida
        const historyTickets = tickets?.filter((t: HistoryTicket) => 
          t.estado?.toLowerCase() === "completado" || t.fecha_hora_salida
        ).sort((a: HistoryTicket, b: HistoryTicket) => 
          new Date(b.fecha_hora_salida || b.fecha_hora_entrada || 0).getTime() - 
          new Date(a.fecha_hora_salida || a.fecha_hora_entrada || 0).getTime()
        ) || [];
        
        console.log('Historial de tickets cargado:', historyTickets);
        setUserTicketsHistory(historyTickets);
      } catch (error) {
        console.error('Error cargando historial:', error);
        setUserTicketsHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserTicketsHistory();
  }, [user]);

  if (!user) return null;

  const columns = [
    { key: "id", label: "ID" },
    { 
      key: "contenedor_info", 
      label: "Contenedor",
      render: (value: unknown) => {
        const info = value as ContenedorInfo | undefined;
        return (
          <span className="font-mono text-sm">
            {info?.codigo_barras || info?.numero_contenedor || 'N/A'}
          </span>
        );
      }
    },
    { 
      key: "contenedor_info", 
      label: "Tipo",
      render: (value: unknown) => {
        const info = value as ContenedorInfo | undefined;
        return info?.tipo || 'N/A';
      }
    },
    { 
      key: "ubicacion_info", 
      label: "Ubicación",
      render: (value: unknown) => {
        const info = value as UbicacionInfo | undefined;
        return info?.zona_nombre ? `Zona ${info.zona_nombre}` : 'N/A';
      }
    },
    { 
      key: "estado", 
      label: "Estado Final",
      render: (value: string) => {
        const variants: Record<string, string> = {
          "completado": "bg-green-100 text-green-800",
          "cancelado": "bg-red-100 text-red-800"
        };
        return (
          <Badge className={variants[value?.toLowerCase()] || "bg-gray-100 text-gray-600"}>
            {value?.replace('_', ' ').toUpperCase() || 'PROCESADO'}
          </Badge>
        );
      }
    },
    { 
      key: "fecha_hora_entrada", 
      label: "Entrada",
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    { 
      key: "fecha_hora_salida", 
      label: "Salida",
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Completado'
    },
  ];

  const sidebarItems = [
    { name: "Dashboard", path: "/client/dashboard", icon: LayoutGrid },
    { name: "Mis Tickets", path: "/client/my-tickets", icon: List },
    { name: "Historial", path: "/client/history", icon: HistoryIcon },
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Historial de Tickets</h1>
            <p className="text-muted-foreground">Consulta el historial completo de tickets completados</p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando historial...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={userTicketsHistory}
              searchKeys={["estado"]}
              itemsPerPage={10}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default History;
