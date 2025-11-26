import { useState, useEffect } from "react";
import { QrCode, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import OperatorLayout from "@/components/OperatorLayout";
import { tickets } from "@/data/mocks";

interface ValidateTicketProps {
  operatorName: string;
}

interface ValidatedTicket {
  id: number;
  estado: string;
  [key: string]: unknown;
}

const ValidateTicket = ({ operatorName }: ValidateTicketProps) => {
  const [qrCode, setQrCode] = useState("");
  const [validatedTicket, setValidatedTicket] = useState<ValidatedTicket | null>(null);
  const [userName, setUserName] = useState("Operario");
  
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  const handleValidate = () => {
    if (!qrCode.trim()) {
      toast.error("Por favor ingrese un código QR");
      return;
    }

    const ticket = tickets.find(t => t.qrCode === qrCode.trim());

    if (!ticket) {
      toast.error("Código QR no válido", {
        description: "No se encontró ningún ticket con este código"
      });
      setValidatedTicket(null);
      return;
    }

    setValidatedTicket(ticket);
    
    if (ticket.estado === "Pendiente") {
      toast.success("Ticket validado correctamente", {
        description: `Ticket #${ticket.id} listo para procesar`
      });
    } else {
      toast.info(`Estado actual: ${ticket.estado}`, {
        description: `Este ticket ya fue procesado`
      });
    }
  };

  const handleConfirm = () => {
    if (!validatedTicket) return;

    toast.success("Ticket confirmado", {
      description: `Ticket #${validatedTicket.id} marcado como validado por ${operatorName}`
    });

    // Simular actualización de estado
    setValidatedTicket({ ...validatedTicket, estado: "Validado" });
  };

  return (
    <OperatorLayout userName={userName}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Validar Código QR
          </CardTitle>
          <CardDescription>Escanea o ingresa el código QR del ticket</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qrInput">Código QR</Label>
            <Input
              id="qrInput"
              placeholder="Ej: ENAPU-TKT-001"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleValidate()}
            />
          </div>
          
          <Button onClick={handleValidate} className="w-full" size="lg">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Validar Ticket
          </Button>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center">
              💡 Presiona Enter después de ingresar el código para validar rápidamente
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultado de la Validación</CardTitle>
          <CardDescription>Información del ticket validado</CardDescription>
        </CardHeader>
        <CardContent>
          {validatedTicket ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Estado:</span>
                <Badge className={
                  validatedTicket.estado === "Pendiente" ? "bg-warning text-warning-foreground" :
                  validatedTicket.estado === "Validado" ? "bg-success text-success-foreground" :
                  "bg-primary text-primary-foreground"
                }>
                  {validatedTicket.estado}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ticket ID:</span>
                  <span className="font-semibold">#{validatedTicket.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Código QR:</span>
                  <span className="font-mono text-sm">{validatedTicket.qrCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Contenedor:</span>
                  <span className="font-medium">{validatedTicket.contenedorId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Placa:</span>
                  <span className="font-medium">{validatedTicket.placa}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Conductor:</span>
                  <span className="font-medium">{validatedTicket.conductor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Turno:</span>
                  <span className="font-medium">{validatedTicket.turno}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Slot:</span>
                  <Badge variant="outline">{validatedTicket.slot}</Badge>
                </div>
              </div>

              {validatedTicket.estado === "Pendiente" && (
                <Button onClick={handleConfirm} className="w-full" size="lg">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirmar Validación
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <QrCode className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Ingresa un código QR para ver la información del ticket
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </OperatorLayout>
  );
};

export default ValidateTicket;
