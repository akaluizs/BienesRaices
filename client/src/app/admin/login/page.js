'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Mail, Lock, LogIn, AlertCircle, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Login con Supabase Auth
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      // Verificar si es administrador
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        throw new Error('No tienes permisos de administrador');
      }

      setSuccess('¡Login exitoso! Redirigiendo...');
      
      // Guardar en localStorage
      localStorage.setItem('admin_id', admin.id);
      localStorage.setItem('admin_email', admin.email);
      localStorage.setItem('admin_nombre', admin.nombre);

      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="body-theme min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-xela-navy mb-2">Panel Administrador</h1>
          <p className="text-granito">Inicia sesión para gestionar propiedades</p>
        </div>

        {/* FORMULARIO */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-900 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-green-900 text-sm">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-xela-navy mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-granito" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bienesraices.com"
                  className="w-full pl-10 pr-4 py-3 border border-niebla rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-xela-navy mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-granito" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-niebla rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* BOTÓN LOGIN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group bg-cerro-verde hover:bg-xela-navy text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <LogIn className="w-5 h-5" />
              <span>{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
            </button>

            {/* LINK RECUPERAR */}
            <div className="text-center">
              <Link href="/forgot-password" className="text-sm text-cerro-verde hover:text-xela-navy transition">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <p className="text-center text-granito text-sm mt-6">
          ¿No tienes cuenta? Contacta al administrador principal
        </p>
      </div>
    </main>
  );
}