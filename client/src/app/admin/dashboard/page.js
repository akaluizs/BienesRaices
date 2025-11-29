'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, Plus, BarChart3, Package } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    contacts: 0,
  });

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Verificar si es admin
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (!adminData) {
        await supabase.auth.signOut();
        router.push('/login');
        return;
      }

      setAdmin(adminData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      router.push('/login');
    }
  };

  const loadStats = async () => {
    try {
      const { count: propertiesCount } = await supabase
        .from('propiedades')
        .select('*', { count: 'exact', head: true });

      const { count: contactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      setStats({
        properties: propertiesCount || 0,
        contacts: contactsCount || 0,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('admin_id');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_nombre');
    router.push('/login');
  };

  if (loading) {
    return <div className="body-theme min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <main className="body-theme min-h-screen">
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-xela-navy">Panel de Control</h1>
            <p className="text-granito text-sm">Bienvenido, {admin?.nombre}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="container mx-auto px-4 py-12">
        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-granito text-sm">Total de Propiedades</p>
                <p className="text-4xl font-bold text-xela-navy">{stats.properties}</p>
              </div>
              <Package className="w-12 h-12 text-cerro-verde opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-granito text-sm">Mensajes Recibidos</p>
                <p className="text-4xl font-bold text-xela-navy">{stats.contacts}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-arena opacity-50" />
            </div>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/propiedades">
            <div className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition cursor-pointer group">
              <Package className="w-12 h-12 text-cerro-verde mb-4 group-hover:scale-110 transition" />
              <h3 className="text-xl font-bold text-xela-navy mb-2">Gestionar Propiedades</h3>
              <p className="text-granito text-sm">Ver, crear, editar o eliminar propiedades</p>
              <p className="text-cerro-verde font-bold mt-4">Ver más →</p>
            </div>
          </Link>

          <Link href="/admin/contactos">
            <div className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition cursor-pointer group">
              <BarChart3 className="w-12 h-12 text-arena mb-4 group-hover:scale-110 transition" />
              <h3 className="text-xl font-bold text-xela-navy mb-2">Ver Contactos</h3>
              <p className="text-granito text-sm">Gestiona los mensajes de los clientes</p>
              <p className="text-arena font-bold mt-4">Ver más →</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}