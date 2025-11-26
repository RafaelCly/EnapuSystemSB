import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { systemConfig, portsSlots } from "@/data/mocks";

const SystemConfigView = () => {
  const [userName, setUserName] = useState("Administrador");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <AdminLayout userName={userName}>
          <h1 className="text-3xl font-bold mb-6">Configuración del Sistema (Solo Lectura)</h1>
          <div className="grid gap-6 max-w-4xl">
            <Card>
              <CardHeader><CardTitle>Horario de Operación</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Inicio:</strong> {systemConfig.horarioOperacion.inicio}</p>
                <p><strong>Fin:</strong> {systemConfig.horarioOperacion.fin}</p>
                <p><strong>Días:</strong> {systemConfig.horarioOperacion.diasLaborales.join(", ")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Slots Disponibles (Solo Vista)</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {portsSlots.map(slot => (
                    <div key={slot.id} className="p-3 bg-muted rounded-lg">
                      <p className="font-semibold">{slot.nombre}</p>
                      <p className="text-sm text-muted-foreground">{slot.zona}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
    </AdminLayout>
  );
};

export default SystemConfigView;
