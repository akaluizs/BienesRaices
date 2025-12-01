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
  Loader2,
  Expand,
  X,
  ChevronLeft,
  ChevronRight,
  Grid3x3
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoadError, setImageLoadError] = useState({});

  useEffect(() => {
    if (params.id) {
      loadProperty();
    }
  }, [params.id]);

  // Bloquear scroll cuando fullscreen está abierto
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  // NAVEGACIÓN CON TECLADO
  useEffect(() => {
    if (!isFullscreen || !property?.images) return;

    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'Escape':
          setIsFullscreen(false);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, currentImageIndex, property]);

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
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const handleWhatsApp = () => {
    const message = `Hola, me interesa esta propiedad: ${property.title} - Q${property.price.toLocaleString()}. ${window.location.href}`;
    const whatsappUrl = `https://wa.me/50240000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleImageError = (index) => {
    setImageLoadError(prev => ({ ...prev, [index]: true }));
  };

  const nextImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const openFullscreen = (index = 0) => {
    setCurrentImageIndex(index);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  // Función para obtener color según el tipo
  const getTypeColor = (type) => {
    const colors = {
      'Casa': 'bg-blue-500',
      'Apartamento': 'bg-purple-500',
      'Terreno': 'bg-green-500',
      'Local Comercial': 'bg-orange-500',
      'Oficina': 'bg-cyan-500',
    };
    return colors[type] || 'bg-naranja';
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
    <>
      {/* CONTENIDO PRINCIPAL - Con blur condicional */}
      <div className={`min-h-screen bg-gris-claro transition-all duration-300 ${isFullscreen ? 'blur-sm scale-95' : ''}`}>
        
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

        {/* CONTENIDO PRINCIPAL */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* COLUMNA PRINCIPAL - INFO */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* GALERÍA ESTILO AIRBNB - DINÁMICA */}
                <div className="relative">
                  {property.images && property.images.length > 0 ? (
                    <>
                      {/* CASO 1: Solo 1 imagen */}
                      {property.images.length === 1 && (
                        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden cursor-pointer group" onClick={() => openFullscreen(0)}>
                          {!imageLoadError[0] ? (
                            <Image
                              src={property.images[0]}
                              alt={`${property.title} - Principal`}
                              fill
                              className="object-cover group-hover:brightness-90 transition-all"
                              priority
                              onError={() => handleImageError(0)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gris-medio">
                              <Home className="w-16 h-16 text-gris-oscuro/30" />
                            </div>
                          )}
                          
                          <div className="absolute top-4 left-4 z-10">
                            <Badge className={`${getTypeColor(property.type)} text-blanco font-bold px-4 py-2 shadow-lg border-0`}>
                              {property.type}
                            </Badge>
                          </div>

                          <div className="absolute inset-0 bg-negro/0 group-hover:bg-negro/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Expand className="w-12 h-12 text-blanco" />
                          </div>
                        </div>
                      )}

                      {/* CASO 2: 2 imágenes - Grid 1x2 */}
                      {property.images.length === 2 && (
                        <div className="grid grid-cols-2 gap-2 h-[500px]">
                          {property.images.map((image, index) => (
                            <div 
                              key={index}
                              className={`relative overflow-hidden cursor-pointer group ${
                                index === 0 ? 'rounded-l-2xl' : 'rounded-r-2xl'
                              }`}
                              onClick={() => openFullscreen(index)}
                            >
                              {!imageLoadError[index] ? (
                                <Image
                                  src={image}
                                  alt={`${property.title} - Imagen ${index + 1}`}
                                  fill
                                  className="object-cover group-hover:brightness-90 transition-all"
                                  priority={index === 0}
                                  onError={() => handleImageError(index)}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gris-medio">
                                  <Home className="w-16 h-16 text-gris-oscuro/30" />
                                </div>
                              )}

                              {index === 0 && (
                                <div className="absolute top-4 left-4 z-10">
                                  <Badge className={`${getTypeColor(property.type)} text-blanco font-bold px-4 py-2 shadow-lg border-0`}>
                                    {property.type}
                                  </Badge>
                                </div>
                              )}

                              <div className="absolute inset-0 bg-negro/0 group-hover:bg-negro/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Expand className="w-12 h-12 text-blanco" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CASO 3: 3 imágenes - Principal grande + 2 pequeñas apiladas */}
                      {property.images.length === 3 && (
                        <div className="grid grid-cols-2 gap-2 h-[500px]">
                          <div 
                            className="relative rounded-l-2xl overflow-hidden cursor-pointer group"
                            onClick={() => openFullscreen(0)}
                          >
                            {!imageLoadError[0] ? (
                              <Image
                                src={property.images[0]}
                                alt={`${property.title} - Principal`}
                                fill
                                className="object-cover group-hover:brightness-90 transition-all"
                                priority
                                onError={() => handleImageError(0)}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gris-medio">
                                <Home className="w-16 h-16 text-gris-oscuro/30" />
                              </div>
                            )}

                            <div className="absolute top-4 left-4 z-10">
                              <Badge className={`${getTypeColor(property.type)} text-blanco font-bold px-4 py-2 shadow-lg border-0`}>
                                {property.type}
                              </Badge>
                            </div>

                            <div className="absolute inset-0 bg-negro/0 group-hover:bg-negro/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Expand className="w-12 h-12 text-blanco" />
                            </div>
                          </div>

                          <div className="grid grid-rows-2 gap-2">
                            {property.images.slice(1, 3).map((image, index) => (
                              <div 
                                key={index + 1}
                                className={`relative overflow-hidden cursor-pointer group ${
                                  index === 0 ? 'rounded-tr-2xl' : 'rounded-br-2xl'
                                }`}
                                onClick={() => openFullscreen(index + 1)}
                              >
                                {!imageLoadError[index + 1] ? (
                                  <Image
                                    src={image}
                                    alt={`${property.title} - Imagen ${index + 2}`}
                                    fill
                                    className="object-cover group-hover:brightness-90 transition-all"
                                    onError={() => handleImageError(index + 1)}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gris-medio">
                                    <Home className="w-8 h-8 text-gris-oscuro/30" />
                                  </div>
                                )}

                                <div className="absolute inset-0 bg-negro/0 group-hover:bg-negro/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <Expand className="w-8 h-8 text-blanco" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CASO 4: 4 imágenes - Grid 2x2 */}
                      {property.images.length === 4 && (
                        <div className="grid grid-cols-2 gap-2 h-[500px]">
                          {property.images.map((image, index) => (
                            <div 
                              key={index}
                              className={`relative overflow-hidden cursor-pointer group ${
                                index === 0 ? 'rounded-tl-2xl' :
                                index === 1 ? 'rounded-tr-2xl' :
                                index === 2 ? 'rounded-bl-2xl' : 'rounded-br-2xl'
                              }`}
                              onClick={() => openFullscreen(index)}
                            >
                              {!imageLoadError[index] ? (
                                <Image
                                  src={image}
                                  alt={`${property.title} - Imagen ${index + 1}`}
                                  fill
                                  className="object-cover group-hover:brightness-90 transition-all"
                                  priority={index === 0}
                                  onError={() => handleImageError(index)}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gris-medio">
                                  <Home className="w-16 h-16 text-gris-oscuro/30" />
                                </div>
                              )}

                              {index === 0 && (
                                <div className="absolute top-4 left-4 z-10">
                                  <Badge className={`${getTypeColor(property.type)} text-blanco font-bold px-4 py-2 shadow-lg border-0`}>
                                    {property.type}
                                  </Badge>
                                </div>
                              )}

                              <div className="absolute inset-0 bg-negro/0 group-hover:bg-negro/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Expand className="w-12 h-12 text-blanco" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CASO 5: 5 o más imágenes - Layout Airbnb original */}
                      {property.images.length >= 5 && (
                        <div className="grid grid-cols-4 gap-2 h-[500px]">
                          {/* IMAGEN PRINCIPAL - Ocupa 2 columnas y 2 filas */}
                          <div 
                            className="col-span-2 row-span-2 relative rounded-l-2xl overflow-hidden cursor-pointer group"
                            onClick={() => openFullscreen(0)}
                          >
                            {!imageLoadError[0] ? (
                              <Image
                                src={property.images[0]}
                                alt={`${property.title} - Principal`}
                                fill
                                className="object-cover group-hover:brightness-90 transition-all"
                                priority
                                onError={() => handleImageError(0)}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gris-medio">
                                <Home className="w-16 h-16 text-gris-oscuro/30" />
                              </div>
                            )}
                            
                            <div className="absolute top-4 left-4 z-10">
                              <Badge className={`${getTypeColor(property.type)} text-blanco font-bold px-4 py-2 shadow-lg border-0`}>
                                {property.type}
                              </Badge>
                            </div>

                            <div className="absolute inset-0 bg-negro/0 group-hover:bg-negro/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Expand className="w-12 h-12 text-blanco" />
                            </div>
                          </div>

                          {/* IMÁGENES SECUNDARIAS - Grid 2x2 al lado derecho */}
                          {property.images.slice(1, 5).map((image, index) => (
                            <div 
                              key={index + 1}
                              className={`relative overflow-hidden cursor-pointer group ${
                                index === 1 ? 'rounded-tr-2xl' : 
                                index === 3 ? 'rounded-br-2xl' : ''
                              }`}
                              onClick={() => openFullscreen(index + 1)}
                            >
                              {!imageLoadError[index + 1] ? (
                                <Image
                                  src={image}
                                  alt={`${property.title} - Imagen ${index + 2}`}
                                  fill
                                  className="object-cover group-hover:brightness-90 transition-all"
                                  onError={() => handleImageError(index + 1)}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gris-medio">
                                  <Home className="w-8 h-8 text-gris-oscuro/30" />
                                </div>
                              )}

                              <div className="absolute inset-0 bg-negro/0 group-hover:bg-negro/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Expand className="w-8 h-8 text-blanco" />
                              </div>

                              {/* Botón "Ver todas" en la última imagen si hay más de 5 */}
                              {index === 3 && property.images.length > 5 && (
                                <div className="absolute inset-0 bg-negro/60 hover:bg-negro/70 transition-all flex flex-col items-center justify-center text-blanco">
                                  <Grid3x3 className="w-8 h-8 mb-2" />
                                  <span className="font-bold text-lg">+{property.images.length - 5}</span>
                                  <span className="text-sm">Ver más fotos</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Botón "Ver todas las fotos" flotante - BLANCO SÓLIDO */}
                      {property.images.length > 1 && (
                        <button
                          onClick={() => openFullscreen(0)}
                          className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 border-2 border-black text-black font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                          <Grid3x3 className="w-4 h-4" />
                          Mostrar todas las fotos ({property.images.length})
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="relative w-full h-[500px] bg-gris-medio flex items-center justify-center rounded-2xl">
                      <div className="text-center">
                        <Home className="w-24 h-24 text-gris-oscuro/30 mx-auto mb-4" />
                        <p className="text-gris-oscuro/50 text-lg font-semibold">Sin imágenes disponibles</p>
                      </div>
                    </div>
                  )}

                  {/* Botón "Ver todas las fotos" flotante - BLANCO SÓLIDO */}
                  {property.images.length > 0 && (
                    <button
                      onClick={() => openFullscreen(0)}
                      className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 border-2 border-black text-black font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <Grid3x3 className="w-4 h-4" />
                      Mostrar todas las fotos ({property.images.length})
                    </button>
                  )}
                </div>

                {/* Título y precio */}
                <Card>
                  <CardContent className="p-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gris-oscuro mb-3">
                      {property.title}
                    </h1>
                    
                    <div className="flex items-center gap-2 text-gris-oscuro mb-6">
                      <MapPin className="w-5 h-5 text-naranja" />
                      <p className="text-lg font-medium">{property.location}</p>
                    </div>

                    <div className="bg-gradient-to-r from-naranja/10 to-amarillo-dorado/10 rounded-xl p-6 border-2 border-naranja/30">
                      <p className="text-sm text-gris-oscuro/70 font-medium mb-2">Precio</p>
                      <h2 className="text-4xl md:text-5xl font-extrabold text-naranja">
                        Q {property.price.toLocaleString()}
                      </h2>
                    </div>
                  </CardContent>
                </Card>

                {/* Características */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-gris-oscuro mb-6 flex items-center gap-3">
                      <CheckCircle className="w-7 h-7 text-naranja" />
                      Características
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {property.area && (
                        <div className="flex flex-col items-center p-4 bg-gris-claro rounded-xl hover:bg-naranja/10 transition-colors">
                          <div className="bg-naranja/20 p-3 rounded-full mb-2">
                            <Ruler className="w-6 h-6 text-naranja" />
                          </div>
                          <p className="text-2xl font-bold text-gris-oscuro mb-1">{property.area}</p>
                          <p className="text-xs text-gris-oscuro/70 font-medium">m² de área</p>
                        </div>
                      )}

                      {property.bedrooms && (
                        <div className="flex flex-col items-center p-4 bg-gris-claro rounded-xl hover:bg-naranja/10 transition-colors">
                          <div className="bg-naranja/20 p-3 rounded-full mb-2">
                            <Users className="w-6 h-6 text-naranja" />
                          </div>
                          <p className="text-2xl font-bold text-gris-oscuro mb-1">{property.bedrooms}</p>
                          <p className="text-xs text-gris-oscuro/70 font-medium">Habitaciones</p>
                        </div>
                      )}

                      {property.bathrooms && (
                        <div className="flex flex-col items-center p-4 bg-gris-claro rounded-xl hover:bg-naranja/10 transition-colors">
                          <div className="bg-naranja/20 p-3 rounded-full mb-2">
                            <Droplet className="w-6 h-6 text-naranja" />
                          </div>
                          <p className="text-2xl font-bold text-gris-oscuro mb-1">{property.bathrooms}</p>
                          <p className="text-xs text-gris-oscuro/70 font-medium">Baños</p>
                        </div>
                      )}

                      <div className="flex flex-col items-center p-4 bg-gris-claro rounded-xl hover:bg-naranja/10 transition-colors">
                        <div className="bg-naranja/20 p-3 rounded-full mb-2">
                          <Home className="w-6 h-6 text-naranja" />
                        </div>
                        <p className="text-base font-bold text-gris-oscuro mb-1">{property.type}</p>
                        <p className="text-xs text-gris-oscuro/70 font-medium">Tipo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Descripción */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-gris-oscuro mb-4">
                      Descripción
                    </h3>
                    <p className="text-gris-oscuro/80 leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </CardContent>
                </Card>

              </div>

              {/* COLUMNA LATERAL - CONTACTO */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 border-2 border-naranja/30">
                  <CardContent className="p-6">
                    
                    <h3 className="text-xl font-bold text-gris-oscuro mb-4 text-center">
                      ¿Te interesa esta propiedad?
                    </h3>

                    <div className="space-y-3 mb-4">
                      
                      {/* WhatsApp */}
                      <Button
                        onClick={handleWhatsApp}
                        className="w-full btn-cta py-5 text-base font-bold shadow-naranja group"
                      >
                        <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Contactar por WhatsApp
                      </Button>

                      {/* Teléfono */}
                      <a href="tel:+50240000000">
                        <Button
                          variant="outline"
                          className="w-full border-2 border-naranja text-naranja hover:bg-naranja hover:text-blanco py-5 text-base font-bold transition-all"
                        >
                          <Phone className="w-5 h-5 mr-2" />
                          +502 4000 0000
                        </Button>
                      </a>

                      {/* Email */}
                      <a href="mailto:contacto@multinmuebles.com">
                        <Button
                          variant="outline"
                          className="w-full border-2 border-gris-medio hover:border-naranja hover:text-naranja py-5 text-base font-bold transition-all"
                        >
                          <Mail className="w-5 h-5 mr-2" />
                          Enviar Email
                        </Button>
                      </a>
                    </div>

                    <Separator className="my-4" />

                    {/* Info adicional */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-gris-oscuro/70">
                        <Calendar className="w-5 h-5 text-naranja" />
                        <span>
                          Publicado: {new Date(property.createdAt).toLocaleDateString('es-GT')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-gris-oscuro/70">
                        <CheckCircle className="w-5 h-5 text-naranja" />
                        <span>Propiedad verificada</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="bg-gradient-to-br from-naranja/10 to-amarillo-dorado/10 rounded-xl p-4 border border-naranja/30">
                      <p className="text-center text-xs text-gris-oscuro/80 leading-relaxed">
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

      {/* MODAL FULLSCREEN - Fuera del contenedor con blur */}
      {isFullscreen && property.images && property.images.length > 0 && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          
          {/* Header con info + hint de teclado */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-6">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge className={`${getTypeColor(property.type)} text-white font-bold px-4 py-2 border-0 shadow-lg`}>
                  {property.type}
                </Badge>
                <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold text-sm border border-white/20">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
                {/* Hint de navegación */}
                <div className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-md text-white/70 px-3 py-1.5 rounded-full text-xs border border-white/10">
                  <span>←</span>
                  <span>→</span>
                  <span className="text-white/50">|</span>
                  <span>ESC</span>
                </div>
              </div>
              
              <button
                onClick={closeFullscreen}
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition-all hover:scale-110 border border-white/20"
                aria-label="Cerrar (ESC)"
                title="Cerrar (ESC)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Imagen principal */}
          <div className="relative w-full h-full flex items-center justify-center p-4 pt-24 pb-32">
            <div className="relative w-full h-full max-w-6xl">
              {!imageLoadError[currentImageIndex] ? (
                <Image
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                  onError={() => handleImageError(currentImageIndex)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Home className="w-24 h-24 text-white/30 mb-4" />
                  <p className="text-white/50 text-lg">Imagen no disponible</p>
                </div>
              )}
            </div>

            {/* Navegación */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-4 rounded-full transition-all hover:scale-110 border border-white/20 group"
                  aria-label="Anterior (←)"
                  title="Anterior (←)"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-4 rounded-full transition-all hover:scale-110 border border-white/20 group"
                  aria-label="Siguiente (→)"
                  title="Siguiente (→)"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas en la parte inferior */}
          {property.images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
              <div className="container mx-auto overflow-x-auto scrollbar-hide">
                <div className="flex gap-3 justify-center pb-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden transition-all flex-shrink-0 ${
                        index === currentImageIndex 
                          ? 'ring-4 ring-naranja scale-110' 
                          : 'opacity-50 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <div className="relative w-20 h-20 bg-gray-800">
                        {!imageLoadError[index] ? (
                          <Image
                            src={image}
                            alt={`Miniatura ${index + 1}`}
                            fill
                            className="object-cover"
                            onError={() => handleImageError(index)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="w-6 h-6 text-white/30" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}