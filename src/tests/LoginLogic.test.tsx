import { describe, it, expect, vi } from 'vitest';

// --- 1. CONFIGURACIÓN DEL MOCK (SIMULADOR) ---

// Creamos un objeto "Constructor" que simula la cadena de Supabase.
// Usamos 'mockReturnThis()' para que .select() y .eq() devuelvan el mismo objeto
// y la cadena no se rompa.
const mockSupabaseBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn() // Esta será la función final que devuelve los datos
};

// Simulamos el objeto supabase principal
const supabase = {
    from: vi.fn().mockReturnValue(mockSupabaseBuilder)
};

// --- 2. LÓGICA A PROBAR (TU CÓDIGO) ---

async function login(email: string, password: string) {
    // Nota: Aquí usamos el objeto 'supabase' simulado de arriba
    const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('activo', true)
        .single();

    if (error || !data) {
        throw new Error('Credenciales inválidas');
    }
    return data;
}

// --- 3. PRUEBAS AUTOMATIZADAS (TEST SUITE) ---

describe('Parte C - Regresión del Módulo de Login', () => {

    // Escenario 1: Ruta de Éxito (Happy Path)
    it('Debe retornar los datos del usuario cuando las credenciales son correctas', async () => {
        // Arrange: Configuramos que .single() devuelva éxito
        const usuarioSimulado = { id: 1, email: 'ricardo.soto@enapu.com', rol: 'admin' };
        
        // Le decimos al mock: "Cuando llamen a single(), devuelve estos datos"
        mockSupabaseBuilder.single.mockResolvedValueOnce({ data: usuarioSimulado, error: null });

        // Act: Ejecutamos la función
        const resultado = await login('ricardo.soto@enapu.com', 'admin123');

        // Assert: Verificamos el resultado
        expect(resultado).toEqual(usuarioSimulado);
    });

    // Escenario 2: Ruta de Fallo (Exception Path)
    it('Debe lanzar un error cuando las credenciales son incorrectas', async () => {
        // Arrange: Configuramos que .single() devuelva error
        mockSupabaseBuilder.single.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });

        // Act & Assert: Verificamos que lance la excepción exacta
        // Vitest espera que la promesa sea rechazada
        await expect(login('wrong@email.com', 'wrongpass')).rejects.toThrow('Credenciales inválidas');
    });
});