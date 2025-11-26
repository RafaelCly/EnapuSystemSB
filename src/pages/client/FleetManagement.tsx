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

interface Container {
  codigo_barras?: string;
  numero_contenedor?: string;
  tipo?: string;
  ticket_estado?: string;
  fecha_entrada?: string;
  ubicacion?: {
    zona_nombre?: string;
  };
  [key: string]: unknown;
}

interface Ticket {
  contenedor_info?: Container;
  estado?: string;
  fecha_hora_entrada?: string;
  [key: string]: unknown;
}

const FleetManagement = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userContainers, setUserContainers] = useState<Container[]>([]);
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

  // Cargar contenedores del usuario (a través de tickets)
  useEffect(() => {
    const loadUserContainers = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const tickets = await api.tickets.byUsuario(user.id);
        
        // Extraer contenedores únicos de los tickets
        const containersMap = new Map<string, Container>();
        tickets?.forEach((ticket: Ticket) => {
          if (ticket.contenedor_info && !containersMap.has(ticket.contenedor_info.codigo_barras)) {
            containersMap.set(ticket.contenedor_info.codigo_barras, {
              ...ticket.contenedor_info,
              ticket_estado: ticket.estado,
              fecha_entrada: ticket.fecha_hora_entrada,
              ubicacion: ticket.ubicacion_info
            });
          }
        });
        
        const containers = Array.from(containersMap.values());
        console.log('Contenedores del cliente cargados:', containers);
        setUserContainers(containers);
      } catch (error) {
        console.error('Error cargando contenedores:', error);
        setUserContainers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserContainers();
  }, [user]);

  if (!user) return null;

  const columns = [
    { 
      key: "codigo_barras", 
      label: "Código",
      render: (value: string) => <span className="font-mono text-sm">{value}</span>
    },
    { 
      key: "numero_contenedor", 
      label: "Número",
      render: (value: string) => <span className="font-mono font-semibold">{value}</span>
    },
    { key: "tipo", label: "Tipo" },
    { key: "dimensiones", label: "Dimensiones" },
    { 
      key: "peso", 
      label: "Peso (kg)",
      render: (value: number) => value?.toLocaleString() || 'N/A'
    },
    { 
      key: "ticket_estado", 
      label: "Estado",
      render: (value: string) => {
        const variants: Record<string, string> = {
          "pendiente": "bg-blue-100 text-blue-800",
          "en_proceso": "bg-yellow-100 text-yellow-800",
          "en_espera": "bg-gray-100 text-gray-800",
          "completado": "bg-green-100 text-green-800"
        };
        return (
          <Badge className={variants[value?.toLowerCase()] || "bg-gray-100 text-gray-600"}>
            {value?.replace('_', ' ').toUpperCase() || 'N/A'}
          </Badge>
        );
      }
    },
    { 
      key: "ubicacion", 
      label: "Ubicación",
      render: (value: unknown) => {
        const ubicacion = value as { zona_nombre?: string } | undefined;
        return ubicacion?.zona_nombre ? `Zona ${ubicacion.zona_nombre}` : 'Sin asignar';
      }
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Flota</h1>
            <p className="text-muted-foreground">Administra tus contenedores registrados</p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando contenedores...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={userContainers}
              searchKeys={["codigo_barras", "numero_contenedor", "tipo"]}
              itemsPerPage={10}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default FleetManagement;
