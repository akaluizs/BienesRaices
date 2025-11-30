'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  LogOut, 
  Home, 
  MessageSquare, 
  Newspaper,
  TrendingUp,
  Users,
  Building2,
  Mail,
  Eye,
  CheckCircle,
  Clock,
  Loader2,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    propiedades: 0,
    propiedadesActivas: 0,
    contactos: 0,
    contactosNuevos: 0,
    anuncios: 0,
    anunciosActivos: 0,
  });
  const [recentActivities, setRecentActivities] = useState({
    propiedades: [],
    contactos: [],
    anuncios: []
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (admin) {
      loadStats();
      loadRecentActivities();
    }
  }, [admin]);

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
      // Propiedades
      const { count: propiedadesCount } = await supabase
        .from('propiedades')
        .select('*', { count: 'exact', head: true });

      const { count: propiedadesActivasCount } = await supabase
        .from('propiedades')
        .select('*', { count: 'exact', head: true })
        .eq('disponible', true);

      // Contactos
      const { count: contactosCount } = await supabase
        .from('contactos')
        .select('*', { count: 'exact', head: true });

      const { count: contactosNuevosCount } = await supabase
        .from('contactos')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'nuevo');

      // Anuncios
      const { count: anunciosCount } = await supabase
        .from('anuncios')
        .select('*', { count: 'exact', head: true });

      const { count: anunciosActivosCount } = await supabase
        .from('anuncios')
        .select('*', { count: 'exact', head: true })
        .eq('activo', true);

      setStats({
        propiedades: propiedadesCount || 0,
        propiedadesActivas: propiedadesActivasCount || 0,
        contactos: contactosCount || 0,
        contactosNuevos: contactosNuevosCount || 0,
        anuncios: anunciosCount || 0,
        anunciosActivos: anunciosActivosCount || 0,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const loadRecentActivities = async () => {
    try {
      // Últimas 3 propiedades
      const { data: propiedades } = await supabase
        .from('propiedades')
        .select('id, titulo, tipo, created_at, disponible')
        .order('created_at', { ascending: false })
        .limit(3);

      // Últimos 3 contactos
      const { data: contactos } = await supabase
        .from('contactos')
        .select('id, nombre, asunto, estado, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      // Últimos 3 anuncios
      const { data: anuncios } = await supabase
        .from('anuncios')
        .select('id, titulo, activo, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      setRecentActivities({
        propiedades: propiedades || [],
        contactos: contactos || [],
        anuncios: anuncios || []
      });
    } catch (error) {
      console.error('Error cargando actividades recientes:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('admin_id');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_nombre');
    router.push('/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getEstadoBadge = (estado) => {
    switch(estado) {
      case 'nuevo':
        return 'bg-blue-500';
      case 'contactado':
        return 'bg-yellow-500';
      case 'resuelto':
        return 'bg-green-500';
      default:
        return 'bg-gris-medio';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gris-claro flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-naranja mb-4 mx-auto" />
          <p className="text-gris-oscuro text-lg font-semibold">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gris-claro">
      {/* HEADER */}
      <header className="bg-gradient-primary text-blanco shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
                <BarChart3 className="w-9 h-9 text-amarillo-dorado" />
                Panel de Control
              </h1>
              <p className="text-blanco/90 mt-2 text-lg">
                Bienvenido de nuevo, <span className="font-bold text-amarillo-dorado">{admin?.nombre}</span>
              </p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-rojo-naranja hover:bg-rojo-naranja/90 text-blanco font-bold py-6 px-6 rounded-xl shadow-lg transition-all hover:scale-105"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* ESTADÍSTICAS PRINCIPALES */}
        <div>
          <h2 className="text-2xl font-bold text-gris-oscuro mb-6 flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-naranja" />
            Estadísticas Generales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PROPIEDADES */}
            <Card className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-naranja">
                    <Home className="w-7 h-7 text-blanco" />
                  </div>
                  <Link href="/admin/propiedades">
                    <Button variant="ghost" size="sm" className="text-naranja hover:text-naranja hover:bg-naranja/10">
                      Ver todas →
                    </Button>
                  </Link>
                </div>
                <h3 className="text-sm font-semibold text-gris-oscuro/70 mb-2">Propiedades</h3>
                <div className="flex items-end gap-3">
                  <p className="text-4xl font-extrabold text-naranja">{stats.propiedades}</p>
                  <div className="mb-2">
                    <Badge className="bg-green-500 text-blanco text-xs">
                      {stats.propiedadesActivas} activas
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CONTACTOS */}
            <Card className="border-2 border-gris-medio hover:border-blue-500 transition-all hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-7 h-7 text-blue-500" />
                  </div>
                  <Link href="/admin/contactos">
                    <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-500 hover:bg-blue-50">
                      Ver todos →
                    </Button>
                  </Link>
                </div>
                <h3 className="text-sm font-semibold text-gris-oscuro/70 mb-2">Contactos</h3>
                <div className="flex items-end gap-3">
                  <p className="text-4xl font-extrabold text-blue-500">{stats.contactos}</p>
                  <div className="mb-2">
                    <Badge className="bg-yellow-500 text-blanco text-xs">
                      {stats.contactosNuevos} nuevos
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ANUNCIOS */}
            <Card className="border-2 border-gris-medio hover:border-purple-500 transition-all hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Newspaper className="w-7 h-7 text-purple-500" />
                  </div>
                  <Link href="/admin/anuncios">
                    <Button variant="ghost" size="sm" className="text-purple-500 hover:text-purple-500 hover:bg-purple-50">
                      Ver todos →
                    </Button>
                  </Link>
                </div>
                <h3 className="text-sm font-semibold text-gris-oscuro/70 mb-2">Anuncios</h3>
                <div className="flex items-end gap-3">
                  <p className="text-4xl font-extrabold text-purple-500">{stats.anuncios}</p>
                  <div className="mb-2">
                    <Badge className="bg-green-500 text-blanco text-xs">
                      {stats.anunciosActivos} activos
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div>
          <h2 className="text-2xl font-bold text-gris-oscuro mb-6 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-naranja" />
            Acciones Rápidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/propiedades/nueva">
              <Card className="border-2 border-naranja/50 hover:border-naranja hover:shadow-xl transition-all cursor-pointer group bg-gradient-to-br from-naranja/5 to-amarillo-dorado/5">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-naranja mb-4 group-hover:scale-110 transition-transform">
                    <Home className="w-7 h-7 text-blanco" />
                  </div>
                  <h3 className="text-xl font-bold text-gris-oscuro mb-2">Nueva Propiedad</h3>
                  <p className="text-gris-oscuro/70 text-sm">
                    Agrega una nueva propiedad al catálogo
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/anuncios/nuevo">
              <Card className="border-2 border-purple-500/50 hover:border-purple-500 hover:shadow-xl transition-all cursor-pointer group bg-gradient-to-br from-purple-50 to-purple-100/50">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                    <Newspaper className="w-7 h-7 text-blanco" />
                  </div>
                  <h3 className="text-xl font-bold text-gris-oscuro mb-2">Nuevo Anuncio</h3>
                  <p className="text-gris-oscuro/70 text-sm">
                    Publica avances de proyectos
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/contactos">
              <Card className="border-2 border-blue-500/50 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                    <Mail className="w-7 h-7 text-blanco" />
                  </div>
                  <h3 className="text-xl font-bold text-gris-oscuro mb-2">Ver Mensajes</h3>
                  <p className="text-gris-oscuro/70 text-sm">
                    Revisa los contactos recibidos
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* ACTIVIDAD RECIENTE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PROPIEDADES RECIENTES */}
          <Card className="border-2 border-gris-medio">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gris-oscuro flex items-center gap-2">
                <Home className="w-5 h-5 text-naranja" />
                Propiedades Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.propiedades.length > 0 ? (
                recentActivities.propiedades.map((propiedad) => (
                  <div key={propiedad.id} className="flex items-center justify-between p-3 bg-gris-claro rounded-lg hover:bg-naranja/5 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gris-oscuro text-sm line-clamp-1">
                        {propiedad.titulo}
                      </p>
                      <p className="text-xs text-gris-oscuro/70">
                        {propiedad.tipo} • {formatDate(propiedad.created_at)}
                      </p>
                    </div>
                    <Badge className={propiedad.disponible ? 'bg-green-500' : 'bg-red-500'}>
                      {propiedad.disponible ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gris-oscuro/50 text-sm text-center py-4">
                  No hay propiedades recientes
                </p>
              )}
            </CardContent>
          </Card>

          {/* CONTACTOS RECIENTES */}
          <Card className="border-2 border-gris-medio">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gris-oscuro flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                Contactos Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.contactos.length > 0 ? (
                recentActivities.contactos.map((contacto) => (
                  <div key={contacto.id} className="flex items-center justify-between p-3 bg-gris-claro rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gris-oscuro text-sm">
                        {contacto.nombre}
                      </p>
                      <p className="text-xs text-gris-oscuro/70 line-clamp-1">
                        {contacto.asunto}
                      </p>
                    </div>
                    <Badge className={getEstadoBadge(contacto.estado)}>
                      {contacto.estado}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gris-oscuro/50 text-sm text-center py-4">
                  No hay contactos recientes
                </p>
              )}
            </CardContent>
          </Card>

          {/* ANUNCIOS RECIENTES */}
          <Card className="border-2 border-gris-medio">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gris-oscuro flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-purple-500" />
                Anuncios Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.anuncios.length > 0 ? (
                recentActivities.anuncios.map((anuncio) => (
                  <div key={anuncio.id} className="flex items-center justify-between p-3 bg-gris-claro rounded-lg hover:bg-purple-50 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gris-oscuro text-sm line-clamp-1">
                        {anuncio.titulo}
                      </p>
                      <p className="text-xs text-gris-oscuro/70">
                        {formatDate(anuncio.created_at)}
                      </p>
                    </div>
                    <Badge className={anuncio.activo ? 'bg-green-500' : 'bg-red-500'}>
                      {anuncio.activo ? <Eye className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gris-oscuro/50 text-sm text-center py-4">
                  No hay anuncios recientes
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}