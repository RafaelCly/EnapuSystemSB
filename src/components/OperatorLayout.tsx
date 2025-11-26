import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, CheckCircle2, LogIn, LogOut, Monitor, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface OperatorLayoutProps {
  children: ReactNode;
  userName?: string;
}

const OperatorLayout = ({ children, userName = "Operario" }: OperatorLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    
    if (storedRole !== "OPERARIO") {
      navigate("/");
      return;
    }
  }, [navigate]);

  const sidebarItems = [
    { name: "Panel de Operaciones", path: "/operator/panel", icon: LayoutDashboard },
    { name: "Validar Contenedor", path: "/operator/scan", icon: CheckCircle2 },
    { name: "Ingreso", path: "/operator/entry", icon: LogIn },
    { name: "Salida", path: "/operator/exit", icon: LogOut },
    { name: "Monitor", path: "/operator/monitor", icon: Monitor },
    { name: "Consulta", path: "/operator/query", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="OPERARIO" userName={userName} />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OperatorLayout;
