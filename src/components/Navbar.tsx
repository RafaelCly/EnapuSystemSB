import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  userRole: string;
  userName: string;
  notifications?: number;
}

const Navbar = ({ userRole, userName, notifications = 0 }: NavbarProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(() => {
    try {
      return localStorage.getItem('mobileMenuOpen') === '1';
    } catch {
      return false;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      CLIENTE: "Cliente",
      OPERARIO: "Operario",
      ADMIN: "Administrador"
    };
    return labels[role] || role;
  };

  const getRoleBadgeClass = (role: string) => {
    // Todos los roles tendrán el mismo estilo: fondo blanco con texto oscuro y borde
    return "bg-white text-primary border-0 font-medium";
  };

  return (
    <nav className="bg-primary border-b border-primary-light shadow-md sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo y Título */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-bold text-accent-foreground text-xl">
                  E
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-primary-foreground font-bold text-xl">ENAPU</h1>
                  <p className="text-primary-foreground/70 text-xs">Sistema de Gestión de Tickets</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <Badge className={`px-3 py-1 ${getRoleBadgeClass(userRole)}`}>
              {getRoleLabel(userRole)}
            </Badge>
            
            <div className="flex items-center gap-2 text-primary-foreground">
              <User className="h-4 w-4" />
              <span
                className="text-sm cursor-pointer"
                onClick={() => navigate("/client/profile")}
              >
                {userName}
              </span>
            </div>

          {notifications > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="relative text-primary-foreground hover:text-primary-foreground hover:bg-primary-light"
              onClick={() => navigate("/client/notifications")}
            >
              <Bell className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {notifications}
              </Badge>
            </Button>
          )}

            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-light"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const next = !mobileMenuOpen;
                setMobileMenuOpen(next);
                try { localStorage.setItem('mobileMenuOpen', next ? '1' : '0'); } catch (error) {
                  console.error('Failed to save mobile menu state:', error);
                }
              }}
              className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-light"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-light border-t border-primary">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <div className="flex items-center gap-2 py-2 text-primary-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm">{userName}</span>
            </div>
            <div className="py-2">
              <Badge className={`px-3 py-1 ${getRoleBadgeClass(userRole)}`}>
                {getRoleLabel(userRole)}
              </Badge>
            </div>
            {notifications > 0 && (
              <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:text-primary-foreground hover:bg-primary">
                <Bell className="h-4 w-4 mr-2" />
                Notificaciones ({notifications})
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start text-primary-foreground hover:text-primary-foreground hover:bg-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
