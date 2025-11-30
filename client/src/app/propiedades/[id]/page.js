'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Ruler, 
  Users, 
  Droplet, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Share2,
  CheckCircle,
  Home,
  DollarSign,
  Calendar,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      loadProperty();
    }
  }, [params.id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      if (data) {
        const formattedProperty = {
          id: data.id,
          title: data.titulo,
          price: data.precio,
          location: data.ubicacion,
          description: data.descripcion,
          images: data.imagenes || [],
          area: data.metros2,
          bedrooms: data.habitaciones,
          bathrooms: data.banos,
          type: data.tipo,
          createdAt: data.created_at,
        };
        setProperty(formattedProperty);
      }
    } catch (error) {
      console.error('Error cargando propiedad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Mira esta propiedad: ${property.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error compartiendo:', error);
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const handleWhatsApp = () => {
    const message = `Hola, me interesa esta propiedad: ${property.title} - Q${property.price.toLocaleString()}. ${window.location.href}`;
    const whatsappUrl = `https://wa.me/50240000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gris-claro flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-naranja mx-auto mb-4" />
          <p className="text-gris-oscuro text-lg font-semibold">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gris-claro flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-12 text-center">
            <Home className="w-16 h-16 text-gris-oscuro/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gris-oscuro mb-4">
              Propiedad no encontrada
            </h2>
            <p className="text-gris-oscuro/70 mb-6">
              La propiedad que buscas no existe o fue removida.
            </p>
            <Link href="/propiedades">
              <Button className="btn-cta px-8 py-3 rounded-xl font-bold shadow-naranja">
                Ver Todas las Propiedades
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gris-claro">
      
      {/* HEADER CON BREADCRUMB */}
      <section className="bg-blanco border-b border-gris-medio py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            
            {/* Botón volver */}
            <Link href="/propiedades">
              <Button 
                variant="ghost" 
                className="text-gris-oscuro hover:text-naranja transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver a Propiedades
              </Button>
            </Link>

            {/* Botón compartir */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              className="border-2 border-gris-medio rounded-full hover:border-naranja"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* GALERÍA DE IMÁGENES */}
      <section className="bg-negro">
        <div className="container mx-auto px-4 py-8">
          
          {property.images && property.images.length > 0 ? (
            <div className="space-y-4">
              
              {/* Imagen principal */}
              <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Badge de tipo */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-cta text-blanco font-bold px-6 py-2 text-base shadow-naranja">
                    {property.type}
                  </Badge>
                </div>

                {/* Navegación de imágenes */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? property.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-blanco/90 hover:bg-blanco text-negro p-3 rounded-full transition-all hover:scale-110"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>

                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === property.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-blanco/90 hover:bg-blanco text-negro p-3 rounded-full transition-all hover:scale-110 rotate-180"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>

                    {/* Indicador de imagen */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-negro/70 backdrop-blur-md text-blanco px-4 py-2 rounded-full text-sm font-semibold">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Miniaturas */}
              {property.images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 rounded-lg overflow-hidden transition-all ${
                        index === currentImageIndex 
                          ? 'ring-4 ring-naranja scale-105' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden bg-gris-medio flex items-center justify-center">
              <Home className="w-24 h-24 text-gris-oscuro/30" />
            </div>
          )}
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMNA PRINCIPAL - INFO */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Título y precio */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-extrabold text-gris-oscuro mb-4">
                        {property.title}
                      </h1>
                      
                      <div className="flex items-center gap-2 text-gris-oscuro mb-6">
                        <MapPin className="w-5 h-5 text-naranja" />
                        <p className="text-lg font-medium">{property.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-naranja/10 to-amarillo-dorado/10 rounded-xl p-6 border-2 border-naranja/30">
                    <p className="text-sm text-gris-oscuro/70 font-medium mb-2">Precio</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold">
                      <span 
                        style={{
                          background: 'linear-gradient(135deg, #FF8C00, #E04A1F, #FFD700)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        Q {property.price.toLocaleString()}
                      </span>
                    </h2>
                  </div>
                </CardContent>
              </Card>

              {/* Características */}
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gris-oscuro mb-6 flex items-center gap-3">
                    <CheckCircle className="w-7 h-7 text-naranja" />
                    Características
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {property.area && (
                      <div className="flex flex-col items-center p-6 bg-gris-claro rounded-xl hover:bg-naranja/10 transition-colors">
                        <div className="bg-naranja/20 p-4 rounded-full mb-3">
                          <Ruler className="w-8 h-8 text-naranja" />
                        </div>
                        <p className="text-3xl font-bold text-gris-oscuro mb-1">{property.area}</p>
                        <p className="text-sm text-gris-oscuro/70 font-medium">m² de área</p>
                      </div>
                    )}

                    {property.bedrooms && (
                      <div className="flex flex-col items-center p-6 bg-gris-claro rounded-xl hover:bg-naranja/10 transition-colors">
                        <div className="bg-naranja/20 p-4 rounded-full mb-3">
                          <Users className="w-8 h-8 text-naranja" />
                        </div>
                        <p className="text-3xl font-bold text-gris-oscuro mb-1">{property.bedrooms}</p>
                        <p className="text-sm text-gris-oscuro/70 font-medium">Habitaciones</p>
                      </div>
                    )}

                    {property.bathrooms && (
                      <div className="flex flex-col items-center p-6 bg-gris-claro rounded-xl hover:bg-naranja/10 transition-colors">
                        <div className="bg-naranja/20 p-4 rounded-full mb-3">
                          <Droplet className="w-8 h-8 text-naranja" />
                        </div>
                        <p className="text-3xl font-bold text-gris-oscuro mb-1">{property.bathrooms}</p>
                        <p className="text-sm text-gris-oscuro/70 font-medium">Baños</p>
                      </div>
                    )}

                    <div className="flex flex-col items-center p-6 bg-gris-claro rounded-xl hover:bg-naranja/10 transition-colors">
                      <div className="bg-naranja/20 p-4 rounded-full mb-3">
                        <Home className="w-8 h-8 text-naranja" />
                      </div>
                      <p className="text-lg font-bold text-gris-oscuro mb-1">{property.type}</p>
                      <p className="text-sm text-gris-oscuro/70 font-medium">Tipo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Descripción */}
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gris-oscuro mb-6">
                    Descripción
                  </h3>
                  <p className="text-gris-oscuro/80 leading-relaxed text-lg whitespace-pre-line">
                    {property.description}
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* COLUMNA LATERAL - CONTACTO */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-2 border-naranja/30">
                <CardContent className="p-8">
                  
                  <h3 className="text-2xl font-bold text-gris-oscuro mb-6 text-center">
                    ¿Te interesa esta propiedad?
                  </h3>

                  <div className="space-y-4 mb-6">
                    
                    {/* WhatsApp */}
                    <Button
                      onClick={handleWhatsApp}
                      className="w-full btn-cta py-6 text-base font-bold shadow-naranja group"
                    >
                      <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Contactar por WhatsApp
                    </Button>

                    {/* Teléfono */}
                    <a href="tel:+50240000000">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-naranja text-naranja hover:bg-naranja hover:text-blanco py-6 text-base font-bold transition-all"
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        +502 4000 0000
                      </Button>
                    </a>

                    {/* Email */}
                    <a href="mailto:contacto@multinmuebles.com">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-gris-medio hover:border-naranja hover:text-naranja py-6 text-base font-bold transition-all"
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Enviar Email
                      </Button>
                    </a>
                  </div>

                  <Separator className="my-6" />

                  {/* Info adicional */}
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3 text-gris-oscuro/70">
                      <Calendar className="w-5 h-5 text-naranja" />
                      <span>
                        Publicado: {new Date(property.createdAt).toLocaleDateString('es-GT')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-gris-oscuro/70">
                      <DollarSign className="w-5 h-5 text-naranja" />
                      <span>Precio negociable</span>
                    </div>

                    <div className="flex items-center gap-3 text-gris-oscuro/70">
                      <CheckCircle className="w-5 h-5 text-naranja" />
                      <span>Propiedad verificada</span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="bg-gradient-to-br from-naranja/10 to-amarillo-dorado/10 rounded-xl p-6 border border-naranja/30">
                    <p className="text-center text-sm text-gris-oscuro/80 leading-relaxed">
                      <strong className="text-naranja">Multinmuebles</strong> te garantiza 
                      procesos seguros y transparentes en todas tus transacciones inmobiliarias.
                    </p>
                  </div>

                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}