'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Loader2,
  Newspaper,
  CheckCircle,
  AlertCircle,
  XCircle,
  Image as ImageIcon,
  Calendar,
  ToggleLeft,
  ToggleRight,
  ArrowUp,
  ArrowDown,
  Video,
  Youtube,
  HardDrive
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export default function AnunciosPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadAnuncios();
  }, []);

  const showAlert = (type, message, description = '') => {
    setAlert({ type, message, description });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadAnuncios = async () => {
    try {
      const { data, error } = await supabase
        .from('anuncios')
        .select('*')
        .order('orden', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAnuncios(data || []);
      showAlert('success', `${data?.length || 0} anuncios cargados`);
    } catch (error) {
      console.error('Error cargando anuncios:', error);
      showAlert('error', 'Error al cargar anuncios', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Extraer ID de YouTube
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Extraer ID de Google Drive
  const extractDriveId = (url) => {
    if (!url) return null;
    const regex = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Detectar tipo de video
  const detectVideoType = (url) => {
    if (!url) return null;
    if (extractYouTubeId(url)) return 'youtube';
    if (extractDriveId(url)) return 'drive';
    return null;
  };

  // Obtener thumbnail de YouTube
  const getYouTubeThumbnail = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Obtener thumbnail de Drive (o placeholder)
  const getDriveThumbnail = () => {
    return null; // Drive no tiene thumbnails públicos
  };

  const handleToggleActivo = async (id, currentState) => {
    try {
      const { error } = await supabase
        .from('anuncios')
        .update({ activo: !currentState })
        .eq('id', id);

      if (error) throw error;

      setAnuncios(anuncios.map(a => 
        a.id === id ? { ...a, activo: !currentState } : a
      ));

      showAlert('success', `Anuncio ${!currentState ? 'activado' : 'desactivado'}`);
    } catch (error) {
      console.error('Error actualizando estado:', error);
      showAlert('error', 'Error al cambiar estado', error.message);
    }
  };

  const handleChangeOrden = async (id, direction) => {
    const currentIndex = anuncios.findIndex(a => a.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === anuncios.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newAnuncios = [...anuncios];
    [newAnuncios[currentIndex], newAnuncios[newIndex]] = [newAnuncios[newIndex], newAnuncios[currentIndex]];

    try {
      // Actualizar orden en la base de datos
      const updates = newAnuncios.map((anuncio, index) => 
        supabase.from('anuncios').update({ orden: index }).eq('id', anuncio.id)
      );

      await Promise.all(updates);
      setAnuncios(newAnuncios);
      showAlert('success', 'Orden actualizado');
    } catch (error) {
      console.error('Error actualizando orden:', error);
      showAlert('error', 'Error al cambiar orden', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('anuncios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAnuncios(anuncios.filter(a => a.id !== id));
      setDeleteModal(null);
      showAlert('success', 'Anuncio eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando anuncio:', error);
      showAlert('error', 'Error al eliminar el anuncio', error.message);
    }
  };

  const filteredAnuncios = anuncios.filter(anuncio => 
    anuncio.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anuncio.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: anuncios.length,
    activos: anuncios.filter(a => a.activo).length,
    inactivos: anuncios.filter(a => !a.activo).length,
    conVideo: anuncios.filter(a => a.video_url).length,
    conImagen: anuncios.filter(a => a.imagen).length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-16 h-16 animate-spin text-naranja mb-4" />
        <p className="text-gris-oscuro text-lg font-semibold">Cargando anuncios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gris-oscuro flex items-center gap-3">
            <Newspaper className="w-9 h-9 text-naranja" />
            Anuncios de Proyectos
          </h1>
          <p className="text-gris-oscuro/70 mt-2 text-lg">
            Gestiona los anuncios de avances y nuevos proyectos
          </p>
        </div>

        <Link href="/admin/anuncios/nuevo">
          <Button className="btn-cta px-6 py-6 rounded-xl font-bold text-base shadow-naranja group">
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
            Nuevo Anuncio
          </Button>
        </Link>
      </div>

      {/* ALERT */}
      {alert && (
        <Alert className={`border-2 ${
          alert.type === 'success' ? 'bg-green-50 border-green-500' :
          alert.type === 'error' ? 'bg-red-50 border-red-500' :
          'bg-yellow-50 border-yellow-500'
        }`}>
          {alert.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <AlertDescription className={`font-semibold ml-2 ${
            alert.type === 'success' ? 'text-green-800' :
            alert.type === 'error' ? 'text-red-800' :
            'text-yellow-800'
          }`}>
            <div className="font-bold">{alert.message}</div>
            {alert.description && (
              <div className="text-sm font-normal mt-1">{alert.description}</div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-2 border-gris-medio hover:border-naranja transition-all">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-naranja mx-auto mb-2">
                <Newspaper className="w-6 h-6 text-blanco" />
              </div>
              <p className="text-2xl font-extrabold text-naranja">{stats.total}</p>
              <p className="text-xs font-semibold text-gris-oscuro/70">Total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gris-medio hover:border-green-500 transition-all">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-2xl font-extrabold text-green-500">{stats.activos}</p>
              <p className="text-xs font-semibold text-gris-oscuro/70">Activos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gris-medio hover:border-red-500 transition-all">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-2xl font-extrabold text-red-500">{stats.inactivos}</p>
              <p className="text-xs font-semibold text-gris-oscuro/70">Inactivos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gris-medio hover:border-purple-500 transition-all">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Video className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-2xl font-extrabold text-purple-500">{stats.conVideo}</p>
              <p className="text-xs font-semibold text-gris-oscuro/70">Videos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gris-medio hover:border-blue-500 transition-all">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <ImageIcon className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-extrabold text-blue-500">{stats.conImagen}</p>
              <p className="text-xs font-semibold text-gris-oscuro/70">Imágenes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH */}
      <Card className="border-2 border-gris-medio">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gris-oscuro/50" />
            <Input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-6 text-base border-2 border-gris-medio focus:border-naranja rounded-xl"
            />
          </div>
          
          <div className="mt-4">
            <p className="text-gris-oscuro font-semibold">
              {filteredAnuncios.length} {filteredAnuncios.length === 1 ? 'anuncio encontrado' : 'anuncios encontrados'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* GRID ANUNCIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAnuncios.map((anuncio, index) => {
          const videoType = detectVideoType(anuncio.video_url);
          const hasVideo = !!anuncio.video_url;
          const hasImage = !!anuncio.imagen;
          
          return (
            <Card key={anuncio.id} className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group overflow-hidden">
              
              {/* Media Preview */}
              <div className="relative h-56 bg-gris-medio">
                {hasImage ? (
                  // Mostrar imagen
                  <Image 
                    src={anuncio.imagen} 
                    alt={anuncio.titulo}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : hasVideo && videoType === 'youtube' ? (
                  // Mostrar thumbnail de YouTube
                  <>
                    <Image 
                      src={getYouTubeThumbnail(extractYouTubeId(anuncio.video_url))} 
                      alt={anuncio.titulo}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gris-oscuro/40 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <Youtube className="w-8 h-8 text-blanco" />
                      </div>
                    </div>
                  </>
                ) : hasVideo && videoType === 'drive' ? (
                  // Placeholder para Drive
                  <div className="w-full h-full flex flex-col items-center justify-center bg-blue-100">
                    <HardDrive className="w-16 h-16 text-blue-600 mb-2" />
                    <p className="text-sm font-semibold text-blue-600">Video de Drive</p>
                  </div>
                ) : (
                  // Sin media
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gris-oscuro/30" />
                  </div>
                )}
                
                {/* Badge estado */}
                <Badge className={cn(
                  'absolute top-3 right-3 font-bold border-0 shadow-lg',
                  anuncio.activo 
                    ? 'bg-green-500 hover:bg-green-600 text-blanco' 
                    : 'bg-red-500 hover:bg-red-600 text-blanco'
                )}>
                  {anuncio.activo ? 'Activo' : 'Inactivo'}
                </Badge>

                {/* Badge tipo de media */}
                <Badge className="absolute bottom-3 right-3 bg-gris-oscuro/80 text-blanco font-bold border-0 shadow-lg">
                  {hasImage ? (
                    <>
                      <ImageIcon className="w-3 h-3 mr-1" />
                      Imagen
                    </>
                  ) : videoType === 'youtube' ? (
                    <>
                      <Youtube className="w-3 h-3 mr-1" />
                      YouTube
                    </>
                  ) : videoType === 'drive' ? (
                    <>
                      <HardDrive className="w-3 h-3 mr-1" />
                      Drive
                    </>
                  ) : (
                    <>
                      <Video className="w-3 h-3 mr-1" />
                      Video
                    </>
                  )}
                </Badge>

                {/* Número de orden */}
                <Badge className="absolute top-3 left-3 bg-gris-oscuro/80 text-blanco font-bold border-0">
                  #{index + 1}
                </Badge>
              </div>

              <CardContent className="p-5">
                
                {/* Título */}
                <h3 className="text-lg font-bold text-gris-oscuro mb-2 line-clamp-2 group-hover:text-naranja transition-colors min-h-[3.5rem]">
                  {anuncio.titulo}
                </h3>

                {/* Descripción */}
                {anuncio.descripcion && (
                  <p className="text-sm text-gris-oscuro/70 mb-4 line-clamp-2">
                    {anuncio.descripcion}
                  </p>
                )}

                {/* Fecha */}
                <div className="flex items-center gap-2 text-xs text-gris-oscuro/70 mb-4 pt-2 border-t border-gris-medio">
                  <Calendar className="w-4 h-4 text-naranja" />
                  <span>
                    {new Date(anuncio.created_at).toLocaleDateString('es-GT', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Acciones */}
                <div className="space-y-2">
                  {/* Toggle Activo */}
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full border-2 rounded-xl font-bold',
                      anuncio.activo
                        ? 'border-green-500 text-green-600 hover:bg-green-50'
                        : 'border-red-500 text-red-600 hover:bg-red-50'
                    )}
                    onClick={() => handleToggleActivo(anuncio.id, anuncio.activo)}
                  >
                    {anuncio.activo ? (
                      <>
                        <ToggleRight className="w-5 h-5 mr-2" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 mr-2" />
                        Activar
                      </>
                    )}
                  </Button>

                  {/* Botones de orden y acciones */}
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={index === 0}
                      onClick={() => handleChangeOrden(anuncio.id, 'up')}
                      className="border-2 border-gris-medio hover:border-blue-500 hover:bg-blue-50 text-blue-600 rounded-xl disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={index === filteredAnuncios.length - 1}
                      onClick={() => handleChangeOrden(anuncio.id, 'down')}
                      className="border-2 border-gris-medio hover:border-blue-500 hover:bg-blue-50 text-blue-600 rounded-xl disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>

                    <Link href={`/admin/anuncios/editar/${anuncio.id}`}>
                      <Button 
                        variant="outline"
                        size="icon"
                        className="w-full border-2 border-gris-medio hover:border-naranja hover:bg-naranja/10 text-naranja rounded-xl"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteModal(anuncio)}
                      className="border-2 border-gris-medio hover:border-red-500 hover:bg-red-50 text-red-600 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {filteredAnuncios.length === 0 && (
        <Card className="border-2 border-gris-medio">
          <CardContent className="py-20 text-center">
            <div className="w-20 h-20 bg-gris-claro rounded-full flex items-center justify-center mx-auto mb-6">
              <Newspaper className="w-10 h-10 text-gris-oscuro/50" />
            </div>
            <h3 className="text-2xl font-bold text-gris-oscuro mb-3">
              No se encontraron anuncios
            </h3>
            <p className="text-gris-oscuro/70 mb-6">
              {searchTerm 
                ? 'Intenta ajustar la búsqueda' 
                : 'Comienza agregando tu primer anuncio de proyecto'}
            </p>
            <Link href="/admin/anuncios/nuevo">
              <Button className="btn-cta px-8 py-3 rounded-xl font-bold shadow-naranja">
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Anuncio
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 bg-gris-oscuro/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full border-2 border-gris-medio shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gris-oscuro">Eliminar Anuncio</h3>
                  <p className="text-sm text-gris-oscuro/70">Esta acción no se puede deshacer</p>
                </div>
              </div>
              
              <p className="text-gris-oscuro mb-6">
                ¿Estás seguro de que deseas eliminar{' '}
                <span className="font-bold text-naranja">{deleteModal.titulo}</span>?
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 border-2 border-gris-medio hover:bg-gris-claro rounded-xl font-bold py-6"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleDelete(deleteModal.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-blanco rounded-xl font-bold py-6 shadow-lg"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}