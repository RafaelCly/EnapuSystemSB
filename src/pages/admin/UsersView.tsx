import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface User {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  id_rol: number;
  id_nivel_acceso: number;
  rol_nombre?: string;
  nivel_nombre?: string;
  [key: string]: unknown;
}

const UsersView = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    nombre: '', 
    email: '', 
    password: '', 
    telefono: '', 
    empresa: '', 
    id_rol: '', 
    id_nivel_acceso: '' 
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    if (!storedUserId || storedRole?.toUpperCase() !== "ADMINISTRADOR") {
      navigate("/");
      return;
    }
    setUser({ id: parseInt(storedUserId), nombre: '', email: '', id_rol: 0, id_nivel_acceso: 0 });
    // load users from API
    (async () => {
      setLoading(true);
      try {
        const usuarios = await api.usuarios.list();
        console.log('Usuarios cargados:', usuarios); // Debug
        setData(usuarios || []);
      } catch (err) {
        console.error('Failed to load usuarios', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (!user) return null;

  const userName = localStorage.getItem('userName') || 'Admin';

  const columns: Array<{key: string; label: string; render?: (value: unknown, row: User) => React.ReactNode}> = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Teléfono" },
    { key: "empresa", label: "Empresa" },
    { 
      key: "rol_nombre", 
      label: "Rol", 
      render: (value: unknown, row: User) => row.rol_nombre || `ID: ${row.id_rol}`
    },
    { 
      key: "nivel_nombre", 
      label: "Nivel", 
      render: (value: unknown, row: User) => row.nivel_nombre || `ID: ${row.id_nivel_acceso}`
    },
  ];

  return (
    <AdminLayout userName={userName}>
          <h1 className="text-3xl font-bold mb-6">Usuarios del Sistema</h1>

          {loading && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-700">
              Cargando usuarios...
            </div>
          )}

          <div className="mb-6">
            <h2 className="font-semibold mb-2">{editingId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input 
                  className="w-full p-2 border rounded" 
                  placeholder="Nombre completo" 
                  value={form.nombre} 
                  onChange={e => setForm(f => ({...f, nombre: e.target.value}))} 
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input 
                  type="email"
                  className="w-full p-2 border rounded" 
                  placeholder="usuario@ejemplo.com" 
                  value={form.email} 
                  onChange={e => setForm(f => ({...f, email: e.target.value}))} 
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {editingId ? 'Contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
                </label>
                <input 
                  type="password"
                  className="w-full p-2 border rounded" 
                  placeholder={editingId ? 'Nueva contraseña (opcional)' : 'Contraseña'} 
                  value={form.password} 
                  onChange={e => setForm(f => ({...f, password: e.target.value}))} 
                  required={!editingId}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input 
                  type="tel"
                  className="w-full p-2 border rounded" 
                  placeholder="999 999 999" 
                  value={form.telefono} 
                  onChange={e => setForm(f => ({...f, telefono: e.target.value}))} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Empresa</label>
                <input 
                  className="w-full p-2 border rounded" 
                  placeholder="Nombre de la empresa" 
                  value={form.empresa} 
                  onChange={e => setForm(f => ({...f, empresa: e.target.value}))} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rol (ID) *</label>
                <select
                  className="w-full p-2 border rounded" 
                  value={form.id_rol} 
                  onChange={e => setForm(f => ({...f, id_rol: e.target.value}))}
                  required
                >
                  <option value="">Seleccionar rol</option>
                  <option value="1">Administrador (1)</option>
                  <option value="2">Operario (2)</option>
                  <option value="3">Cliente (3)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nivel de Acceso (ID) *</label>
                <select
                  className="w-full p-2 border rounded" 
                  value={form.id_nivel_acceso} 
                  onChange={e => setForm(f => ({...f, id_nivel_acceso: e.target.value}))}
                  required
                >
                  <option value="">Seleccionar nivel</option>
                  <option value="1">Total (1)</option>
                  <option value="2">Parcial (2)</option>
                  <option value="3">Limitado (3)</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90" onClick={async () => {
                try {
                  // Validación básica
                  if (!form.nombre || !form.email || !form.id_rol || !form.id_nivel_acceso) {
                    alert('Por favor complete todos los campos obligatorios (*)');
                    return;
                  }

                  // Validar email
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(form.email)) {
                    alert('Por favor ingrese un email válido');
                    return;
                  }

                  // Validar password solo al crear
                  if (!editingId && !form.password) {
                    alert('La contraseña es obligatoria al crear un usuario');
                    return;
                  }

                  if (form.password && form.password.length < 6) {
                    alert('La contraseña debe tener al menos 6 caracteres');
                    return;
                  }

                  const payload: Partial<User> & {password?: string} = {
                    nombre: form.nombre,
                    email: form.email,
                    telefono: form.telefono,
                    empresa: form.empresa,
                    id_rol: Number(form.id_rol),
                    id_nivel_acceso: Number(form.id_nivel_acceso)
                  };
                  
                  // Solo incluir password si se está creando o si se ingresó uno nuevo
                  if (!editingId || form.password) {
                    payload.password = form.password;
                  }

                  if (editingId) {
                    await api.usuarios.update(editingId, payload);
                  } else {
                    await api.usuarios.create(payload as Parameters<typeof api.usuarios.create>[0]);
                  }
                  const usuarios = await api.usuarios.list();
                  setData(usuarios);
                  setForm({ nombre: '', email: '', password: '', telefono: '', empresa: '', id_rol: '', id_nivel_acceso: '' });
                  setEditingId(null);
                  alert(editingId ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
                } catch (err: unknown) {
                  console.error('Error al guardar usuario:', err);
                  
                  // Mensaje de error más específico
                  let errorMsg = 'Error al guardar usuario';
                  const error = err as Error;
                  if (error.message?.includes('email') || error.message?.includes('unique')) {
                    errorMsg = 'Este email ya está registrado. Por favor use otro.';
                  } else if (error.message) {
                    errorMsg = `Error: ${error.message}`;
                  }
                  
                  alert(errorMsg);
                }
              }}>{editingId ? 'Guardar cambios' : 'Crear Usuario'}</button>
              
              {editingId && (
                <button 
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ nombre: '', email: '', password: '', telefono: '', empresa: '', id_rol: '', id_nivel_acceso: '' });
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          <DataTable columns={columns.concat([{ key: 'actions', label: 'Acciones', render: (_: unknown, row: User) => (
            <div className="flex gap-2">
              <button className="px-2 py-1 bg-amber-500 text-white rounded" onClick={() => { 
                setEditingId(row.id); 
                setForm({ 
                  nombre: row.nombre, 
                  email: row.email || '', 
                  password: '', 
                  telefono: row.telefono || '', 
                  empresa: row.empresa || '', 
                  id_rol: String(row.id_rol), 
                  id_nivel_acceso: String(row.id_nivel_acceso) 
                }); 
              }}>Editar</button>
              <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={async () => { 
                if (!confirm('Eliminar usuario?')) return; 
                await api.usuarios.delete(row.id); 
                setData(await api.usuarios.list()); 
              }}>Eliminar</button>
            </div>
          ) }])} data={data} searchKeys={["nombre", "email"]} />
    </AdminLayout>
  );
};

export default UsersView;
