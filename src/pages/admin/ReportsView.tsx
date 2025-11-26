import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportData } from "@/data/mocks";

const ReportsView = () => {
  const [userName, setUserName] = useState("Administrador");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <AdminLayout userName={userName}>
          <h1 className="text-3xl font-bold mb-6">Reportes y Analítica</h1>
          <div className="grid gap-6">
            <Card>
              <CardHeader><CardTitle>Tiempos de Espera Promedio</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reportData.tiemposEspera.map((item) => (
                    <div key={item.fecha} className="flex justify-between p-2 bg-muted rounded">
                      <span>{item.fecha}</span>
                      <span className="font-semibold">{item.promedio} min</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Volumen de Contenedores</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reportData.volumenContenedores.map((item) => (
                    <div key={item.fecha} className="flex justify-between p-2 bg-muted rounded">
                      <span>{item.fecha}</span>
                      <span className="font-semibold">{item.cantidad} contenedores</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
    </AdminLayout>
  );
};

export default ReportsView;
