import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import ClientDashboard from "./pages/client/ClientDashboard";
import NewTicket from "./pages/client/NewTicket";
import MyTickets from "./pages/client/MyTickets";
import History from "./pages/client/History";
import FleetManagement from "./pages/client/FleetManagement";
import Notifications from "./pages/client/Notifications";
import Profile from "./pages/client/Profile";
import OperatorPanel from "./pages/operator/OperatorPanel";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersView from "./pages/admin/UsersView";
import SystemConfigView from "./pages/admin/SystemConfigView";
import ReportsView from "./pages/admin/ReportsView";
import SystemMonitor from "./pages/admin/SystemMonitor";
import ZonasView from "./pages/admin/ZonasView";
import SlotsView from "./pages/admin/SlotsView";
import ContenedoresView from "./pages/admin/ContenedoresView";
import NotFound from "./pages/NotFound";
import ValidateTicket from "@/pages/operator/ValidateTicket";
import RegisterEntry from "@/pages/operator/RegisterEntry";
import RegisterExit from "@/pages/operator/RegisterExit";
import TurnMonitor from "@/pages/operator/TurnMonitor";
import QuickContainerQuery from "@/pages/operator/QuickContainerQuery";
import ScanTicket from "@/pages/operator/ScanTicket";
import TestConnection from "./pages/TestConnection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/test-connection" element={<TestConnection />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/new-ticket" element={<NewTicket />} />
          <Route path="/client/my-tickets" element={<MyTickets />} />
          <Route path="/client/history" element={<History />} />
          <Route path="/client/fleet" element={<FleetManagement />} />
          <Route path="/client/notifications" element={<Notifications />} />
          <Route path="/client/profile" element={<Profile />} />
          <Route path="/operator/panel" element={<OperatorPanel />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersView />} />
          <Route path="/admin/zonas" element={<ZonasView />} />
          <Route path="/admin/slots" element={<SlotsView />} />
          <Route path="/admin/contenedores" element={<ContenedoresView />} />
          <Route path="/admin/config" element={<SystemConfigView />} />
          <Route path="/admin/reports" element={<ReportsView />} />
          <Route path="/admin/monitor" element={<SystemMonitor />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/operator/panel" element={<OperatorPanel />} />
          <Route path="/operator/scan" element={<ScanTicket />} />
          <Route path="/operator/validate" element={<ValidateTicket operatorName="Carlos López" />} />
          <Route path="/operator/entry" element={<RegisterEntry operatorName="Carlos López" />} />
          <Route path="/operator/exit" element={<RegisterExit operatorName="Carlos López" />} />
          <Route path="/operator/monitor" element={<TurnMonitor />} />
          <Route path="/operator/query" element={<QuickContainerQuery />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
