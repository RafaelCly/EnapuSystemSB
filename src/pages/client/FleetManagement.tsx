import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List, History, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DataTable from "@/components/DataTable";
import { api } from "@/lib/api";

interface User {
  id: number;
  name: string;
  [key: string]: unknown;
}

interface Container {
  id?: number;
  codigo_contenedor?: string;
  tipo?: string;
  dimensiones?: string;
  peso?: number;
  estado?: string;
  id_buque?: number;
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
    
    if (!storedUserId || storedRole?.toUpperCase() !== "CLIENTE") {
      navigate("/");
      return;
    }
    
    setUserId(storedUserId);
    setUser({
      id: parseInt(storedUserId),
      name: storedName || 'Cliente'
    });
  }, [navigate]);

  // Cargar contenedores del usuario directamente
  useEffect(() => {
    const loadUserContainers = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        // Obtener contenedores directamente del cliente
        const containers = await api.contenedores.byCliente(user.id);
        console.log('Contenedores del cliente cargados:', containers);
        setUserContainers(containers || []);
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
      key: "codigo_contenedor", 
      label: "Código",
      render: (value: string) => <span className="font-mono text-sm">{value || 'N/A'}</span>
    },
    { key: "tipo", label: "Tipo" },
    { key: "dimensiones", label: "Dimensiones" },
    { 
      key: "peso", 
      label: "Peso (kg)",
      render: (value: number) => value?.toLocaleString() || 'N/A'
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
