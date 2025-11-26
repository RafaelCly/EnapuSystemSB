import { QrCode, Download, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QRCardProps {
  qrCode: string;
  ticketId: number;
  contenedor: string;
  turno: string;
  slot: string;
}

const QRCard = ({ qrCode, ticketId, contenedor, turno, slot }: QRCardProps) => {
  const handleDownload = () => {
    // Simulación de descarga
    const element = document.createElement('a');
    const file = new Blob([`Ticket: ${qrCode}\nContenedor: ${contenedor}\nTurno: ${turno}\nSlot: ${slot}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `ticket-${ticketId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center bg-primary text-primary-foreground">
        <CardTitle className="text-2xl font-bold">Ticket Generado</CardTitle>
        <Badge variant="secondary" className="mt-2 mx-auto">
          Ticket #{ticketId}
        </Badge>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* QR Code simulado */}
        <div className="flex justify-center">
          <div className="bg-white p-6 rounded-lg border-4 border-primary inline-block">
            <div className="w-48 h-48 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center rounded">
              <QrCode className="h-32 w-32 text-white" />
            </div>
            <p className="text-center mt-3 font-mono text-sm font-bold text-primary">
              {qrCode}
            </p>
          </div>
        </div>

        {/* Información del ticket */}
        <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Contenedor:</span>
            <span className="font-semibold">{contenedor}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Turno:</span>
            <Badge variant="outline">{turno}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Slot Asignado:</span>
            <Badge>{slot}</Badge>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <Button onClick={handleDownload} className="flex-1" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
          <Button onClick={handlePrint} className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Por favor, presente este código QR al momento de su llegada al puerto
        </p>
      </CardContent>
    </Card>
  );
};

export default QRCard;
