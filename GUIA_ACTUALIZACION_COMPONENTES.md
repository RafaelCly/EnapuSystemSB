# 🔄 Guía de Actualización de Componentes

## Cambios en la API - Django → Supabase

### Resumen de Cambios

La API antigua (`apiFetch`) ha sido **completamente reemplazada** por una nueva API que usa **Supabase**.

**Antes** (Django):

```typescript
import { apiFetch } from "@/lib/api";

const data = await apiFetch("/usuarios/");
```

**Ahora** (Supabase):

```typescript
import { api } from "@/lib/api";

const data = await api.usuarios.list();
```

---

## 🔍 Cómo Actualizar tus Componentes

### 1. Cambiar los imports

**Antes:**

```typescript
import { apiFetch } from "@/lib/api";
import axios from "axios"; // Ya no se usa
```

**Después:**

```typescript
import { api } from "@/lib/api";
```

### 2. Actualizar las llamadas a la API

#### Usuarios

**Antes:**

```typescript
// Listar usuarios
const usuarios = await apiFetch("/usuarios/");

// Obtener un usuario
const usuario = await apiFetch(`/usuarios/${id}/`);

// Crear usuario
const nuevoUsuario = await apiFetch("/usuarios/", {
  method: "POST",
  body: JSON.stringify(data),
});

// Actualizar
await apiFetch(`/usuarios/${id}/`, {
  method: "PUT",
  body: JSON.stringify(data),
});

// Eliminar
await apiFetch(`/usuarios/${id}/`, {
  method: "DELETE",
});

// Login
await apiFetch("/usuarios/login/", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});

// Por rol
await apiFetch(`/usuarios/by_role/?role=${role}`);
```

**Después:**

```typescript
// Listar usuarios
const usuarios = await api.usuarios.list();

// Obtener un usuario
const usuario = await api.usuarios.get(id);

// Crear usuario
const nuevoUsuario = await api.usuarios.create(data);

// Actualizar
await api.usuarios.update(id, data);

// Eliminar (soft delete - marca como inactivo)
await api.usuarios.delete(id);

// Login
await api.usuarios.login(email, password);

// Por rol
await api.usuarios.byRole(idRol); // Nota: Ahora usa ID numérico
```

#### Tickets

**Antes:**

```typescript
const tickets = await apiFetch("/tickets/");
const ticket = await apiFetch(`/tickets/${id}/`);
await apiFetch("/tickets/", { method: "POST", body: JSON.stringify(data) });
await apiFetch(`/tickets/${id}/`, {
  method: "PATCH",
  body: JSON.stringify(data),
});
await apiFetch(`/tickets/${id}/`, { method: "DELETE" });
await apiFetch(`/tickets/by_estado/?estado=${estado}`);
await apiFetch(`/tickets/by_usuario/?usuario_id=${usuarioId}`);
await apiFetch(`/tickets/${id}/cambiar_estado/`, {
  method: "PATCH",
  body: JSON.stringify({ estado }),
});
```

**Después:**

```typescript
const tickets = await api.tickets.list();
const ticket = await api.tickets.get(id);
await api.tickets.create(data);
await api.tickets.update(id, data);
await api.tickets.delete(id);
await api.tickets.byEstado(estado);
await api.tickets.byUsuario(usuarioId);
await api.tickets.cambiarEstado(id, estado); // Más simple ✅
```

#### Contenedores

**Antes:**

```typescript
const contenedores = await apiFetch("/contenedores/");
const contenedor = await apiFetch(`/contenedores/${id}/`);
await apiFetch("/contenedores/", {
  method: "POST",
  body: JSON.stringify(data),
});
await apiFetch(`/contenedores/${id}/`, {
  method: "PUT",
  body: JSON.stringify(data),
});
await apiFetch(`/contenedores/${id}/`, { method: "DELETE" });
```

**Después:**

```typescript
const contenedores = await api.contenedores.list();
const contenedor = await api.contenedores.get(id);
await api.contenedores.create(data);
await api.contenedores.update(id, data);
await api.contenedores.delete(id);
```

#### Zonas

**Antes:**

```typescript
const zonas = await apiFetch("/zonas/");
const zona = await apiFetch(`/zonas/${id}/`);
```

**Después:**

```typescript
const zonas = await api.zonas.list();
const zona = await api.zonas.get(id);
```

#### Slots (Ubicacion_slot)

**Antes:**

```typescript
const slots = await apiFetch("/slots/");
const slot = await apiFetch(`/slots/${id}/`);
await apiFetch(`/slots/${id}/`, {
  method: "PATCH",
  body: JSON.stringify(data),
});
```

**Después:**

```typescript
const slots = await api.slots.list();
const slot = await api.slots.get(id);
await api.slots.update(id, data);

// NUEVO: Obtener solo slots disponibles (vacíos)
const slotsDisponibles = await api.slots.disponibles();
```

#### Buques

**Antes:**

```typescript
const buques = await apiFetch("/buques/");
const buque = await apiFetch(`/buques/${id}/`);
await apiFetch("/buques/", { method: "POST", body: JSON.stringify(data) });
```

**Después:**

```typescript
const buques = await api.buques.list();
const buque = await api.buques.get(id);
await api.buques.create(data);
```

#### Roles y Niveles

**Antes:**

```typescript
const roles = await apiFetch("/roles/");
const niveles = await apiFetch("/niveles/");
```

**Después:**

```typescript
const roles = await api.roles.list();
const niveles = await api.niveles.list();
```

---

## 🎁 Nuevas Funciones Disponibles

### Facturas

```typescript
// Listar todas las facturas
const facturas = await api.facturas.list();

// Obtener una factura
const factura = await api.facturas.get(id);

// Crear una factura
const nuevaFactura = await api.facturas.create({
  fecha_emision: "2025-11-26",
  monto: 850.0,
  estado: "Pendiente",
  id_ticket: 10,
  fecha_vencimiento: "2025-12-10",
});

// Obtener facturas por estado
const facturasPendientes = await api.facturas.byEstado("Pendiente");
```

### Citas de Recojo

```typescript
// Listar todas las citas
const citas = await api.citas.list();

// Obtener solo citas programadas
const citasProgramadas = await api.citas.programadas();
```

---

## 📝 Tipos TypeScript

Ahora tienes tipos TypeScript para todas las entidades:

```typescript
import type {
  Usuario,
  Ticket,
  Contenedor,
  Zona,
  UbicacionSlot,
} from "@/lib/api";

// Uso con tipos
const usuario: Usuario = await api.usuarios.get(1);
const tickets: Ticket[] = await api.tickets.list();
```

---

## 🔒 Manejo de Errores

La nueva API maneja errores automáticamente:

```typescript
try {
  const usuario = await api.usuarios.login(email, password);
  // Login exitoso
  console.log("Bienvenido:", usuario.nombre);
} catch (error) {
  // Error automático si falla
  console.error("Login falló:", error.message);
  // Mostrar mensaje al usuario
  alert("Credenciales inválidas");
}
```

---

## 🚀 Ejemplo Completo: Actualizar un Componente

### Antes (Django):

```typescript
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

export function TicketsList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await apiFetch("/tickets/");
        setTickets(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {tickets.map((ticket) => (
        <div key={ticket.id}>{ticket.numero_ticket}</div>
      ))}
    </div>
  );
}
```

### Después (Supabase):

```typescript
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Ticket } from "@/lib/api";

export function TicketsList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await api.tickets.list(); // ✅ Más simple
        setTickets(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {tickets.map((ticket) => (
        <div key={ticket.id}>
          {ticket.numero_ticket}
          {/* ✅ Ahora tienes acceso a datos relacionados */}
          Usuario: {ticket.Usuario?.nombre}
          Contenedor: {ticket.Contenedor?.codigo_contenedor}
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 Beneficios

✅ **Código más limpio** - Menos boilerplate
✅ **Tipos TypeScript** - Autocomplete y seguridad
✅ **Datos relacionados** - JOIN automático de Supabase
✅ **Menos errores** - Manejo automático de errores
✅ **Más rápido** - Sin backend intermedio

---

## 🔍 Buscar y Reemplazar (VS Code)

Para actualizar rápidamente:

1. Abre Find & Replace (`Ctrl+Shift+F`)
2. Busca: `apiFetch\('/([^']+)/'\)`
3. Esto te mostrará todos los usos de `apiFetch`
4. Actualiza manualmente según la tabla arriba

---

## ✅ Checklist de Actualización

- [ ] Todos los `import { apiFetch }` → `import { api }`
- [ ] Todos los endpoints actualizados a funciones de API
- [ ] Tipos TypeScript agregados donde sea necesario
- [ ] Probado que funciona en desarrollo
- [ ] Manejo de errores actualizado si es necesario

---

## 📞 ¿Necesitas Ayuda?

Si un componente específico no sabes cómo actualizarlo:

1. Busca el componente en `src/`
2. Mira qué endpoint usa (ej: `/tickets/`)
3. Busca la sección correspondiente arriba
4. Reemplaza según el ejemplo

---

**¡Listo!** Con esto puedes actualizar todos tus componentes React para usar Supabase. 🚀
