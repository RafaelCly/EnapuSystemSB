import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserCog, ShieldCheck, Ship, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetPath, setTargetPath] = useState<string>("/");
  const [users, setUsers] = useState<Array<{id: number; email: string; nombre: string; id_rol: number; password?: string}>>([]);
  const [rolesMap, setRolesMap] = useState<Record<number,string>>({});

  const roles = [
    {
      id: "CLIENTE",
      name: "Cliente",
      description: "Gestiona tus tickets y flota",
      icon: User,
      path: "/client/dashboard",
      color: "bg-primary text-primary-foreground hover:bg-primary-light"
    },
    {
      id: "OPERARIO",
      name: "Operario",
      description: "Valida y procesa tickets",
      icon: UserCog,
      path: "/operator/panel",
      color: "bg-primary text-primary-foreground hover:bg-primary-light"
    },
    {
      id: "ADMINISTRADOR",
      name: "Administrador",
      description: "Gestiona el sistema completo",
      icon: ShieldCheck,
      path: "/admin/dashboard",
      color: "bg-primary text-primary-foreground hover:bg-primary-light"
    }
  ];

  // Se llama al presionar la tarjeta: abre el formulario vacío
  const openLoginFormForRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    setSelectedRole(roleId);
    setEmail("");
    setPassword("");
    setTargetPath(role.path);
    setShowForm(true);
  };
  // Fetch users and roles from backend to allow real-user login
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [rolesResp, usersResp] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/roles/', {
            mode: 'cors',
            credentials: 'include'
          }).then(r => r.json()),
          fetch('http://127.0.0.1:8000/api/usuarios/', {
            mode: 'cors',
            credentials: 'include'
          }).then(r => r.json()),
        ]);
        if (!mounted) return;
        const map: Record<number,string> = {};
        rolesResp.forEach((r: {id: number; rol: string}) => { map[r.id] = r.rol; });
        setRolesMap(map);
        setUsers(usersResp);
      } catch (err) {
        // ignore, keep demo mode
        console.warn('Could not load users/roles', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !password) {
      toast.error("Ingresa email y contraseña");
      return;
    }

    try {
      // Try real API login first
      const response = await fetch('http://127.0.0.1:8000/api/usuarios/login/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        const roleName = user.rol_nombre || 'OPERARIO';
        
        // Store user info
        localStorage.setItem('userId', String(user.id));
        localStorage.setItem('userRole', roleName);
        localStorage.setItem('userName', user.nombre);
        localStorage.setItem('userEmail', user.email);
        
        toast.success(`Bienvenido ${user.nombre}`, { 
          description: `Has ingresado como ${roleName}` 
        });
        
        // Navigate based on role
        if (roleName === 'ADMINISTRADOR') {
          navigate('/admin/dashboard');
        } else if (roleName === 'OPERARIO') {
          navigate('/operator/panel');
        } else if (roleName === 'CLIENTE') {
          navigate('/client/dashboard');
        } else {
          navigate('/');
        }
        return;
      } else {
        const error = await response.json();
        toast.error(error.error || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Error de conexión con el servidor', {
        description: 'Por favor verifica que el backend esté funcionando'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Ship className="h-14 w-14 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white">ENAPU</h1>
              <p className="text-white/90 text-sm">Sistema de Gestión de Tickets</p>
            </div>
          </div>
          <p className="text-white/80 text-lg">Selecciona tu rol para ingresar al sistema</p>
        </div>

        {/* Role Cards OR Login Screen */}
        {!showForm ? (
          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card 
                  key={role.id} 
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    selectedRole === role.id ? 'ring-4 ring-white' : ''
                  }`}
                  onClick={() => openLoginFormForRole(role.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full ${role.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{role.name}</CardTitle>
                    <CardDescription className="text-sm">{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className={`w-full ${role.color}`} size="lg" onClick={() => openLoginFormForRole(role.id)}>
                      Ingresar como {role.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            {/* If we have users loaded, show a panel with real users to click */}
            {users.length > 0 && (
              <div className="col-span-3 mt-6">
                <h3 className="text-lg font-semibold mb-3 text-white">Usuarios disponibles (clic para login rápido)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {users.slice(0,9).map(u => {
                    const rolNombre = u.rol_nombre || rolesMap[u.id_rol] || 'Usuario';
                    const rolPath = rolNombre === 'ADMINISTRADOR' ? '/admin/dashboard' : 
                                   rolNombre === 'OPERARIO' ? '/operator/panel' : '/client/dashboard';
                    return (
                      <button 
                        key={u.id} 
                        className="bg-white rounded-lg p-4 text-left shadow-md hover:shadow-xl transition-all hover:scale-105" 
                        onClick={() => { 
                          // Auto-fill form with this user's email
                          setEmail(u.email);
                          setPassword('');
                          setSelectedRole(rolNombre === 'ADMINISTRADOR' ? 'ADMINISTRADOR' : rolNombre === 'OPERARIO' ? 'OPERARIO' : 'CLIENTE');
                          setShowForm(true);
                          setTargetPath(rolPath);
                        }}
                      >
                        <div className="font-semibold text-base text-gray-800">{u.nombre}</div>
                        <div className="text-sm text-gray-600 mt-1">Email: {u.email}</div>
                        <div className="text-xs text-primary font-medium mt-2">Rol: {rolNombre}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
              <button
                className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                onClick={() => { setShowForm(false); setSelectedRole(null); }}
              >
                <ArrowLeft className="mr-2" /> Volver
              </button>

              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-md mb-3">
                  <Ship className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
                <p className="text-sm text-gray-500">{roles.find(r => r.id === selectedRole)?.name}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2"
                    placeholder="usuario@enapu.pe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2"
                    placeholder="********"
                    required
                  />
                </div>

                <div>
                  <Button type="submit" className="w-full bg-primary text-white">Iniciar Sesión</Button>
                </div>

                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <div className="font-medium mb-1">Credenciales de prueba:</div>
                  <ul className="list-disc list-inside text-xs">
                    <li>Admin: admin@enapu.com / admin123</li>
                    <li>Operario: operario@enapu.com / operario123</li>
                    <li>Cliente: cliente@empresa.com / cliente123</li>
                  </ul>
                  <div className="mt-1 italic text-xs text-gray-500">Usa las credenciales correctas de la BD</div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-white/70 text-sm">
          <p>© 2024 ENAPU - Empresa Nacional de Puertos S.A.</p>
          <p className="mt-1">Sistema de gestión portuaria con datos simulados</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
