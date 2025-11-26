import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus, List, History, Truck, Bell, User as UserIcon, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import QRCard from "@/components/QRCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { tickets, fleet, portsSlots, users } from "@/data/mocks";

interface User {
  id: number;
  name: string;
  [key: string]: unknown;
}

interface Ticket {
  id: number;
  fecha: string;
  [key: string]: unknown;
}

const NewTicket = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [generatedTicket, setGeneratedTicket] = useState<Ticket | null>(null);

  const [formData, setFormData] = useState({
    contenedorId: "",
    transportista: "",
    placa: "",
    conductor: "",
    prioridad: "Normal"
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    
    if (!storedUserId || storedRole !== "CLIENTE") {
      navigate("/");
      return;
    }
    
    setUserId(storedUserId);
    const foundUser = users.find(u => u.id === parseInt(storedUserId));
    setUser(foundUser);
  }, [navigate]);

  if (!user) return null;

  const userFleet = fleet.filter(f => f.clienteId === user.id);

  const handlePlacaChange = (placa: string) => {
    const vehicle = userFleet.find(v => v.placa === placa);
    if (vehicle) {
      setFormData(prev => ({
        ...prev,
        placa: vehicle.placa,
        conductor: vehicle.conductor
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple
    if (!formData.contenedorId || !formData.transportista || !formData.placa || !formData.conductor) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    // Buscar slot disponible
    const availableSlot = portsSlots.find(s => s.disponible);
    if (!availableSlot) {
      toast.error("No hay slots disponibles en este momento");
      return;
    }

    // Generar nuevo ticket
    const newTicketId = Math.max(...tickets.map(t => t.id)) + 1;
    const newTicket = {
      id: newTicketId,
      contenedorId: formData.contenedorId,
      transportista: formData.transportista,
      placa: formData.placa,
      conductor: formData.conductor,
      estado: "Pendiente",
      turno: "Próximamente",
      fecha: new Date().toISOString().split('T')[0],
      qrCode: `ENAPU-TKT-${String(newTicketId).padStart(3, '0')}`,
      clienteId: user.id,
      slot: availableSlot.id,
      prioridad: formData.prioridad
    };

    // Simular guardado (en app real iría a backend)
    setGeneratedTicket(newTicket);

    toast.success("¡Ticket generado exitosamente!", {
      description: `Código: ${newTicket.qrCode}`
    });
  };

  const sidebarItems = [
    { name: "Dashboard", path: "/client/dashboard", icon: LayoutGrid },
    { name: "Nuevo Ticket", path: "/client/new-ticket", icon: Plus },
    { name: "Mis Tickets", path: "/client/my-tickets", icon: List },
    { name: "Historial", path: "/client/history", icon: History },
    { name: "Gestión de Flota", path: "/client/fleet", icon: Truck },
    //{ name: "Notificaciones", path: "/client/notifications", icon: Bell },
    //{ name: "Perfil", path: "/client/profile", icon: UserIcon },
  ];

  if (generatedTicket) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar userRole="CLIENTE" userName={user.name} />
        
        <div className="flex">
          <Sidebar items={sidebarItems} />
          
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={() => setGeneratedTicket(null)}
                className="mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Generar Otro Ticket
              </Button>

              <QRCard
                qrCode={generatedTicket.qrCode}
                ticketId={generatedTicket.id}
                contenedor={generatedTicket.contenedorId}
                turno={generatedTicket.turno}
                slot={generatedTicket.slot}
              />

              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={() => navigate("/client/my-tickets")}
                  className="flex-1"
                >
                  Ver Mis Tickets
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/client/dashboard")}
                  className="flex-1"
                >
                  Volver al Dashboard
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="CLIENTE" userName={user.name} />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/client/dashboard")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-foreground mb-2">Solicitar Nuevo Ticket</h1>
              <p className="text-muted-foreground">Complete el formulario para generar un ticket de ingreso</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Información del Ticket</CardTitle>
                <CardDescription>Todos los campos son obligatorios</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contenedorId">Número de Contenedor</Label>
                    <Input
                      id="contenedorId"
                      placeholder="Ej: CONT-2024-011"
                      value={formData.contenedorId}
                      onChange={(e) => setFormData(prev => ({ ...prev, contenedorId: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transportista">Transportista</Label>
                    <Input
                      id="transportista"
                      placeholder="Nombre de la empresa transportista"
                      value={formData.transportista}
                      onChange={(e) => setFormData(prev => ({ ...prev, transportista: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="placa">Placa del Vehículo</Label>
                      <Select value={formData.placa} onValueChange={handlePlacaChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una placa" />
                        </SelectTrigger>
                        <SelectContent>
                          {userFleet.map(vehicle => (
                            <SelectItem key={vehicle.id} value={vehicle.placa}>
                              {vehicle.placa} - {vehicle.tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conductor">Conductor</Label>
                      <Input
                        id="conductor"
                        placeholder="Nombre del conductor"
                        value={formData.conductor}
                        onChange={(e) => setFormData(prev => ({ ...prev, conductor: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prioridad">Prioridad</Label>
                    <Select value={formData.prioridad} onValueChange={(value) => setFormData(prev => ({ ...prev, prioridad: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Generar Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewTicket;
