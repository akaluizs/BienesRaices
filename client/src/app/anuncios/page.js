'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  Loader2,
  Sparkles
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
                  Aún no hay anuncios publicados
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

                  {/* Imagen con aspect ratio automático */}
                  <div className="relative w-full bg-gris-medio">
                    {featuredAnuncio.imagen ? (
                      <img
                        src={featuredAnuncio.imagen}
                        alt={featuredAnuncio.titulo}
                        className="w-full h-auto object-contain"
                      />
                    ) : (
                      <div className="w-full h-96 flex items-center justify-center">
                        <Newspaper className="w-24 h-24 text-gris-oscuro/30" />
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center gap-3 mb-6">
                      <Badge className="bg-naranja/10 text-naranja border border-naranja/30 px-4 py-2 font-bold">
                        Destacado
                      </Badge>
                      
                      <div className="flex items-center gap-2 text-gris-oscuro/60">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {formatDate(featuredAnuncio.created_at)}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-extrabold text-gris-oscuro mb-6">
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
                <div className="grid grid-cols-1 gap-8">
                  {regularAnuncios.map((anuncio, index) => (
                    <Card 
                      key={anuncio.id}
                      className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl overflow-hidden"
                    >
                      {/* Imagen con aspect ratio automático */}
                      <div className="relative w-full bg-gris-medio">
                        {anuncio.imagen ? (
                          <img
                            src={anuncio.imagen}
                            alt={anuncio.titulo}
                            className="w-full h-auto object-contain"
                          />
                        ) : (
                          <div className="w-full h-64 flex items-center justify-center">
                            <Newspaper className="w-16 h-16 text-gris-oscuro/30" />
                          </div>
                        )}
                        
                        {/* Número de orden */}
                        <Badge className="absolute top-4 left-4 bg-gris-oscuro/80 text-blanco font-bold px-3 py-1">
                          #{index + 2}
                        </Badge>
                      </div>

                      <CardContent className="p-6">
                        {/* Fecha */}
                        <div className="flex items-center gap-2 text-gris-oscuro/60 text-sm mb-4">
                          <Clock className="w-4 h-4 text-naranja" />
                          <span>{formatDate(anuncio.created_at)}</span>
                        </div>

                        {/* Título */}
                        <h3 className="text-2xl font-bold text-gris-oscuro mb-4">
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
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}