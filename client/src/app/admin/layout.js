'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Home,
  Newspaper,
  MessageSquare, 
  LogOut, 
  Menu,
  X,
  User,
  Shield,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [adminName, setAdminName] = useState('');

  // Rutas públicas que no necesitan autenticación
  const isPublicRoute = pathname === '/admin/login';

  useEffect(() => {
    if (!isPublicRoute) {
      checkAuth();
      loadAdminData();
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

  const loadAdminData = () => {
    const nombre = localStorage.getItem('admin_nombre') || 'Admin';
    setAdminName(nombre);
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
      badge: null
    },
    {
      title: 'Propiedades',
      icon: Home,
      href: '/admin/propiedades',
      badge: null
    },
    {
      title: 'Anuncios',
      icon: Newspaper,
      href: '/admin/anuncios',
      badge: null
    },
    {
      title: 'Contactos',
      icon: MessageSquare,
      href: '/admin/contactos',
      badge: null
    },
  ];

  // Si es ruta pública, mostrar solo el contenido
  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gris-claro to-blanco">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-naranja border-t-transparent rounded-full animate-spin" />
          <p className="text-lg text-gris-oscuro font-semibold">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gris-claro">
      
      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-blanco border-b-2 border-gris-medio z-50 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-naranja/10"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-gris-oscuro" />
            ) : (
              <Menu className="w-6 h-6 text-gris-oscuro" />
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-naranja" />
            <h1 className="text-lg font-bold text-gris-oscuro">Admin Panel</h1>
          </div>
        </div>

        <Avatar className="w-9 h-9 border-2 border-naranja">
          <AvatarFallback className="bg-gradient-cta text-blanco font-bold text-sm">
            {adminName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </header>

      {/* SIDEBAR */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-72 bg-blanco border-r-2 border-gris-medio shadow-2xl z-50 transition-transform duration-300',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* LOGO */}
        <div className="h-16 border-b-2 border-gris-medio flex items-center px-6 bg-gradient-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blanco rounded-xl flex items-center justify-center shadow-naranja">
              <Shield className="w-6 h-6 text-naranja" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-blanco">Admin Panel</h1>
              <p className="text-xs text-blanco/80">Multinmuebles</p>
            </div>
          </div>
        </div>

        {/* USER INFO */}
        <div className="p-4 border-b-2 border-gris-medio bg-gradient-to-br from-naranja/5 to-amarillo-dorado/5">
          <div className="flex items-center gap-3 p-3 bg-blanco rounded-xl border-2 border-gris-medio shadow-sm">
            <Avatar className="w-12 h-12 border-2 border-naranja">
              <AvatarFallback className="bg-gradient-cta text-blanco font-bold">
                {adminName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gris-oscuro truncate">
                {adminName || user?.email}
              </p>
              <Badge className="bg-gradient-cta text-blanco text-xs mt-1">
                <User className="w-3 h-3 mr-1" />
                Administrador
              </Badge>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group relative',
                    isActive
                      ? 'bg-gradient-cta text-blanco shadow-naranja'
                      : 'text-gris-oscuro hover:bg-naranja/10 hover:text-naranja border-2 border-transparent hover:border-naranja/20'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={cn(
                    'w-5 h-5 transition-transform group-hover:scale-110',
                    isActive && 'text-blanco'
                  )} />
                  
                  <span className="font-semibold flex-1">{item.title}</span>
                  
                  {item.badge && (
                    <Badge className="bg-rojo-naranja text-blanco text-xs px-2 py-0.5">
                      {item.badge}
                    </Badge>
                  )}

                  {isActive && (
                    <ChevronRight className="w-5 h-5 text-blanco" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-gris-medio bg-blanco">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 transition-all group font-bold"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gris-oscuro/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* CONTENT */}
      <div className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}