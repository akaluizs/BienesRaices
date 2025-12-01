'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  Loader2,
  Sparkles,
  Video,
  Youtube,
  HardDrive,
  Play
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AnunciosPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnuncios();
  }, []);

  const loadAnuncios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('anuncios')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAnuncios(data || []);
    } catch (error) {
      console.error('Error cargando anuncios:', error);
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

  // Obtener embed URL según el tipo
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const videoType = detectVideoType(url);
    
    if (videoType === 'youtube') {
      const videoId = extractYouTubeId(url);
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (videoType === 'drive') {
      const fileId = extractDriveId(url);
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const featuredAnuncio = anuncios[0];
  const regularAnuncios = anuncios.slice(1);

  // Componente para renderizar media (imagen o video)
  const MediaContent = ({ anuncio, isFeatured = false }) => {
    const hasVideo = !!anuncio.video_url;
    const hasImage = !!anuncio.imagen;
    const videoType = detectVideoType(anuncio.video_url);
    const embedUrl = getEmbedUrl(anuncio.video_url);

    if (hasVideo && embedUrl) {
      return (
        <div className="relative w-full bg-gris-oscuro">
          <div className={`${isFeatured ? 'aspect-video' : 'aspect-video'}`}>
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title={anuncio.titulo}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {/* Badge tipo de video */}
          <Badge className="absolute bottom-4 right-4 bg-gris-oscuro/90 backdrop-blur-sm text-blanco font-bold px-3 py-1 shadow-lg">
            {videoType === 'youtube' ? (
              <>
                <Youtube className="w-3 h-3 mr-1" />
                YouTube
              </>
            ) : (
              <>
                <HardDrive className="w-3 h-3 mr-1" />
                Drive
              </>
            )}
          </Badge>
        </div>
      );
    }

    if (hasImage) {
      return (
        <div className="relative w-full bg-gris-medio">
          <img
            src={anuncio.imagen}
            alt={anuncio.titulo}
            className="w-full h-auto object-contain"
          />
        </div>
      );
    }

    return (
      <div className={`w-full ${isFeatured ? 'h-96' : 'h-64'} flex items-center justify-center bg-gris-medio`}>
        <Newspaper className={`${isFeatured ? 'w-24 h-24' : 'w-16 h-16'} text-gris-oscuro/30`} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gris-claro">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-primary text-blanco py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-amarillo-dorado rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blanco rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 bg-blanco/10 backdrop-blur-md border border-amarillo-dorado/30 rounded-full px-6 py-2 mb-6">
              <Newspaper className="w-5 h-5 text-amarillo-dorado" />
              <span className="text-blanco font-semibold text-sm">
                Anuncios de Proyectos
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Avances y <span className="text-amarillo-dorado">Novedades</span>
            </h1>
            
            <p className="text-xl text-blanco/90 leading-relaxed max-w-3xl mx-auto">
              Conoce los últimos avances de nuestros proyectos inmobiliarios 
              y las nuevas oportunidades en Quetzaltenango.
            </p>

            {/* Stats */}
            {!loading && anuncios.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 bg-blanco/10 backdrop-blur-md rounded-full px-5 py-2 border border-blanco/20">
                  <Newspaper className="w-5 h-5 text-amarillo-dorado" />
                  <span className="font-bold">{anuncios.length}</span>
                  <span className="text-blanco/80">Anuncios</span>
                </div>
                
                {anuncios.filter(a => a.video_url).length > 0 && (
                  <div className="flex items-center gap-2 bg-blanco/10 backdrop-blur-md rounded-full px-5 py-2 border border-blanco/20">
                    <Video className="w-5 h-5 text-amarillo-dorado" />
                    <span className="font-bold">{anuncios.filter(a => a.video_url).length}</span>
                    <span className="text-blanco/80">Videos</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-16 h-16 animate-spin text-naranja mb-4" />
              <p className="text-gris-oscuro text-lg font-semibold">Cargando anuncios...</p>
            </div>
          ) : anuncios.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gris-claro rounded-full flex items-center justify-center mx-auto mb-6">
                  <Newspaper className="w-10 h-10 text-gris-oscuro/50" />
                </div>
                <h3 className="text-2xl font-bold text-gris-oscuro mb-4">
                  No hay anuncios disponibles
                </h3>
                <p className="text-gris-oscuro/70">
                  Aún no hay anuncios publicados. Vuelve pronto para conocer nuestras novedades.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              
              {/* ANUNCIO DESTACADO (MÁS RECIENTE) */}
              {featuredAnuncio && (
                <Card className="border-2 border-naranja/50 overflow-hidden hover:shadow-2xl transition-all bg-gradient-to-br from-naranja/5 to-amarillo-dorado/5 relative">
                  
                  {/* Badge destacado flotante */}
                  <div className="absolute top-6 right-6 z-10">
                    <Badge className="bg-gradient-cta text-blanco font-bold px-4 py-2 shadow-naranja">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Más Reciente
                    </Badge>
                  </div>

                  {/* Media Content */}
                  <MediaContent anuncio={featuredAnuncio} isFeatured={true} />

                  {/* Contenido */}
                  <div className="p-8 lg:p-12">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <Badge className="bg-naranja/10 text-naranja border border-naranja/30 px-4 py-2 font-bold">
                        Destacado
                      </Badge>
                      
                      <div className="flex items-center gap-2 text-gris-oscuro/60">
                        <Calendar className="w-4 h-4 text-naranja" />
                        <span className="text-sm font-medium">
                          {formatDate(featuredAnuncio.created_at)}
                        </span>
                      </div>

                      {/* Badge tipo de contenido */}
                      {featuredAnuncio.video_url ? (
                        <Badge className="bg-purple-100 text-purple-700 border border-purple-300 px-3 py-1 font-bold">
                          <Play className="w-3 h-3 mr-1" />
                          Video
                        </Badge>
                      ) : featuredAnuncio.imagen && (
                        <Badge className="bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 font-bold">
                          <Newspaper className="w-3 h-3 mr-1" />
                          Imagen
                        </Badge>
                      )}
                    </div>

                    <h2 className="text-3xl md:text-4xl font-extrabold text-gris-oscuro mb-6 leading-tight">
                      {featuredAnuncio.titulo}
                    </h2>

                    {featuredAnuncio.descripcion && (
                      <p className="text-lg text-gris-oscuro/80 leading-relaxed whitespace-pre-wrap">
                        {featuredAnuncio.descripcion}
                      </p>
                    )}
                  </div>
                </Card>
              )}

              {/* GRID DE ANUNCIOS REGULARES */}
              {regularAnuncios.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-12 bg-gradient-cta rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gris-oscuro">
                      Más Anuncios
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {regularAnuncios.map((anuncio, index) => (
                      <Card 
                        key={anuncio.id}
                        className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl overflow-hidden group"
                      >
                        {/* Media Content */}
                        <MediaContent anuncio={anuncio} />
                        
                        {/* Número de orden flotante */}
                        <div className="absolute top-4 left-4 z-10">
                          <Badge className="bg-gris-oscuro/90 backdrop-blur-sm text-blanco font-bold px-3 py-1.5 shadow-lg">
                            #{index + 2}
                          </Badge>
                        </div>

                        <CardContent className="p-6 lg:p-8">
                          {/* Fecha y tipo */}
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 text-gris-oscuro/60 text-sm">
                              <Clock className="w-4 h-4 text-naranja" />
                              <span className="font-medium">{formatDate(anuncio.created_at)}</span>
                            </div>

                            {/* Badge tipo de contenido */}
                            {anuncio.video_url ? (
                              <Badge className="bg-purple-100 text-purple-700 border border-purple-300 px-3 py-1 font-bold">
                                <Play className="w-3 h-3 mr-1" />
                                Video
                              </Badge>
                            ) : anuncio.imagen && (
                              <Badge className="bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 font-bold">
                                <Newspaper className="w-3 h-3 mr-1" />
                                Imagen
                              </Badge>
                            )}
                          </div>

                          {/* Título */}
                          <h3 className="text-2xl font-bold text-gris-oscuro mb-4 group-hover:text-naranja transition-colors leading-tight">
                            {anuncio.titulo}
                          </h3>

                          {/* Descripción completa */}
                          {anuncio.descripcion && (
                            <p className="text-gris-oscuro/80 leading-relaxed whitespace-pre-wrap">
                              {anuncio.descripcion}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}