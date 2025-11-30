'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MapPin, Ruler, Users, Droplet, Car, Phone, Mail, MessageSquare, Send, MessageCircle, ArrowRight, Loader2, Home } from 'lucide-react';

export default function PropertyDetailPage({ params }) {
  const { id } = use(params);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        // Transformar datos al formato del componente
        setProperty({
          id: data.id,
          title: data.titulo,
          price: data.precio,
          location: data.ubicacion,
          description: data.descripcion,
          images: data.imagenes || [],
          area: data.metros2,
          bedrooms: data.habitaciones,
          bathrooms: data.banos,
          parking: null, // Si no tienes este campo
          type: data.tipo,
          yearBuilt: null, // Si no tienes este campo
          condition: 'Disponible',
          features: [], // Si no tienes este campo
          description_long: data.descripcion,
          agent: {
            name: 'Agente de Ventas',
            phone: '+502 4000 0000',
            email: 'info@bienesraices.com',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          },
        });
      }
    } catch (error) {
      console.error('Error cargando propiedad:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="body-theme min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cerro-verde" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="body-theme min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-xela-navy mb-4">Propiedad no encontrada</h1>
          <Link href="/propiedades" className="text-cerro-verde hover:text-xela-navy">
            ← Volver a propiedades
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="body-theme property-page">
      {/* GALERÍA DE IMÁGENES */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* IMAGEN PRINCIPAL */}
            <div className="lg:col-span-2">
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden bg-gray-200 group">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-20 h-20 text-slate-400" />
                  </div>
                )}

                {/* CONTROLES DE GALERÍA */}
                {property.images && property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-xela-navy p-3 rounded-full transition z-10"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-xela-navy p-3 rounded-full transition z-10"
                    >
                      →
                    </button>

                    {/* INDICADOR DE IMAGEN */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* MINIATURAS */}
              {property.images && property.images.length > 1 && (
                <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                  {property.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Miniatura ${index + 1}`}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-20 w-20 md:h-24 md:w-24 rounded-lg cursor-pointer object-cover transition ${
                        currentImageIndex === index ? 'ring-2 ring-cerro-verde' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* INFORMACIÓN DERECHA */}
            <div className="space-y-6">
              {/* BADGE TIPO */}
              {property.type && (
                <div className="inline-block bg-cerro-verde text-white px-4 py-2 rounded-lg font-semibold text-sm">
                  {property.type}
                </div>
              )}

              {/* TÍTULO Y PRECIO */}
              <div>
                <h1 className="h1 mb-2">{property.title}</h1>
                <p className="price mb-4">
                  Q {property.price?.toLocaleString()}
                </p>
              </div>

              {/* UBICACIÓN */}
              <div className="flex items-start gap-3 text-granito">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{property.location}</p>
                </div>
              </div>

              {/* CARACTERÍSTICAS PRINCIPALES */}
              <div className="bg-niebla rounded-xl p-4 space-y-3">
                {property.area && (
                  <div className="flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-xela-navy" />
                    <span className="text-granito">{property.area} m²</span>
                  </div>
                )}
                {property.type !== 'Terreno' && property.bedrooms && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-xela-navy" />
                    <span className="text-granito">{property.bedrooms} Habitaciones</span>
                  </div>
                )}
                {property.type !== 'Terreno' && property.bathrooms && (
                  <div className="flex items-center gap-3">
                    <Droplet className="w-5 h-5 text-xela-navy" />
                    <span className="text-granito">{property.bathrooms} Baños</span>
                  </div>
                )}
                {property.parking && (
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-xela-navy" />
                    <span className="text-granito">{property.parking} Parqueo</span>
                  </div>
                )}
              </div>

              {/* BOTONES */}
              <div className="space-y-3 pt-4">
                {/* BOTÓN CONTACTO */}
                <a
                  href={`/contacto?property=${id}`}
                  className="w-full group bg-arena hover:bg-orange-500 text-xela-navy font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-1"
                >
                  <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Solicitar Información</span>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </a>

                {/* BOTÓN WHATSAPP */}
                <a
                  href={`https://wa.me/50240000000?text=Me%20interesa%20la%20propiedad:%20${property.title}%20-%20Q%20${property.price}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <MessageCircle className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">WhatsApp</span>
                  <ArrowRight className="w-5 h-5 relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </a>

                {/* BOTÓN LLAMAR */}
                <a
                  href={`tel:${property.agent.phone}`}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-arena to-orange-400 hover:shadow-lg text-xela-navy font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-arena opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Phone className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10">Llamar</span>
                  <ArrowRight className="w-5 h-5 relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESCRIPCIÓN Y CARACTERÍSTICAS */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* DESCRIPCIÓN */}
            <div className="lg:col-span-2">
              <h2 className="h2 mb-6">Descripción</h2>
              <p className="body-lg mb-8">
                {property.description_long || property.description || 'Sin descripción disponible.'}
              </p>

              {/* CARACTERÍSTICAS */}
              {property.features && property.features.length > 0 && (
                <>
                  <h3 className="h3 mb-6">Características</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 bg-niebla p-4 rounded-lg hover:bg-arena/20 transition-colors">
                        <div className="w-2 h-2 bg-cerro-verde rounded-full" />
                        <span className="body-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* INFORMACIÓN ADICIONAL */}
            <div className="bg-white rounded-2xl p-8 h-fit shadow-lg border border-niebla">
              <h3 className="h3 mb-6">Detalles</h3>
              <div className="space-y-4">
                {property.yearBuilt && (
                  <div className="pb-4 border-b border-niebla">
                    <p className="label text-xs uppercase tracking-wide">Año de construcción</p>
                    <p className="text-xela-navy font-bold body-md mt-1">{property.yearBuilt}</p>
                  </div>
                )}
                <div className="pb-4 border-b border-niebla">
                  <p className="label text-xs uppercase tracking-wide">Condición</p>
                  <p className="text-xela-navy font-bold body-md mt-1">{property.condition}</p>
                </div>
                <div>
                  <p className="label text-xs uppercase tracking-wide">Tipo de propiedad</p>
                  <p className="text-xela-navy font-bold body-md mt-1">{property.type}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}