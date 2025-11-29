'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  LogOut, 
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Rutas públicas que no necesitan autenticación
  const isPublicRoute = pathname === '/admin/login';

  useEffect(() => {
    if (!isPublicRoute) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [pathname]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login'); 
    } else {
      setUser(session.user);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('admin_id');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_nombre');
    router.push('/admin/login'); 
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
    },
    {
      title: 'Propiedades',
      icon: Package,
      href: '/admin/propiedades',
    },
    {
      title: 'Contactos',
      icon: MessageSquare,
      href: '/admin/contactos',
    },
  ];

  // Si es ruta pública, mostrar solo el contenido
  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cerro-verde border-t-transparent rounded-full animate-spin" />
          <p className="text-lg text-granito font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-xl font-bold text-xela-navy">Admin Panel</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-cerro-verde flex items-center justify-center text-white font-bold">
          {user?.email?.[0].toUpperCase()}
        </div>
      </header>

      {/* SIDEBAR */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 shadow-lg z-50 transition-transform duration-300',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* LOGO */}
        <div className="h-16 border-b border-slate-200 flex items-center px-6">
          <div>
            <h1 className="text-xl font-bold text-xela-navy">Admin Panel</h1>
            <p className="text-xs text-granito mt-0.5">Bienes Raíces</p>
          </div>
        </div>

        {/* USER INFO */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-cerro-verde flex items-center justify-center text-white font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-xela-navy truncate">
                {user?.email}
              </p>
              <p className="text-xs text-granito">Administrador</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer group',
                    isActive
                      ? 'bg-cerro-verde text-white shadow-md'
                      : 'text-granito hover:bg-slate-50 hover:text-xela-navy'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={cn(
                    'w-5 h-5 transition-transform group-hover:scale-110',
                    isActive && 'text-white'
                  )} />
                  <span className="font-medium">{item.title}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* CONTENT */}
      <div className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}