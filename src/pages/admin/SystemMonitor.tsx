import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { systemLogs } from "@/data/mocks";

const SystemMonitor = () => {
  const [userName, setUserName] = useState("Administrador");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  const columns = [
    { key: "fecha", label: "Fecha/Hora" },
    { key: "modulo", label: "Módulo" },
    { key: "evento", label: "Evento" },
    { 
      key: "nivel", 
      label: "Nivel",
      render: (value: string) => {
        const variant = value === "error" ? "bg-destructive text-destructive-foreground" : 
                       value === "warning" ? "bg-warning text-warning-foreground" : 
                       value === "success" ? "bg-success text-success-foreground" : "bg-accent text-accent-foreground";
        return <Badge className={variant}>{value}</Badge>;
      }
    },
    { key: "detalle", label: "Detalle" },
  ];

  return (
    <AdminLayout userName={userName}>
      <h1 className="text-3xl font-bold mb-6">Monitor del Sistema</h1>
      <DataTable columns={columns} data={systemLogs} searchKeys={["evento", "modulo", "nivel"]} />
    </AdminLayout>
  );
};

export default SystemMonitor;
