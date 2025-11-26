import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Settings, BarChart3, Activity, MapPin, Grid3x3, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
  userName?: string;
}

const AdminLayout = ({ children, userName = "Administrador" }: AdminLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    
    if (storedRole !== "ADMINISTRADOR") {
      navigate("/");
      return;
    }
  }, [navigate]);

  const sidebarItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Usuarios", path: "/admin/users", icon: Users },
    { name: "Zonas", path: "/admin/zonas", icon: MapPin },
    { name: "Slots", path: "/admin/slots", icon: Grid3x3 },
    { name: "Contenedores", path: "/admin/contenedores", icon: Package },
    { name: "Configuración", path: "/admin/config", icon: Settings },
    { name: "Reportes", path: "/admin/reports", icon: BarChart3 },
    { name: "Monitor del Sistema", path: "/admin/monitor", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="ADMINISTRADOR" userName={userName} />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
