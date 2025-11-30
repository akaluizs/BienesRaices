'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Hero from '@/components/Hero';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';
import { Loader2, Home as HomeIcon, Users, TrendingUp, Phone, CheckCircle, Shield, Clock, Award, Star, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .order('id', { ascending: false })
        .limit(6);

      if (error) throw error;

      const formattedProperties = data.map(prop => ({
        id: prop.id,
        title: prop.titulo,
        price: prop.precio,
        location: prop.ubicacion,
        description: prop.descripcion,
        image: prop.imagenes && prop.imagenes.length > 0 ? prop.imagenes[0] : null,
        area: prop.metros2,
        bedrooms: prop.habitaciones,
        bathrooms: prop.banos,
        parking: null,
        type: prop.tipo,
      }));

      setFeaturedProperties(formattedProperties);
    } catch (error) {
      console.error('Error cargando propiedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      icon: HomeIcon,
      title: "Amplio Catálogo",
      description: "Más de 120 propiedades verificadas en las mejores zonas de Quetzaltenango"
    },
    {
      icon: Shield,
      title: "Procesos Seguros",
      description: "Gestión legal completa y transparente para tu tranquilidad"
    },
    {
      icon: Users,
      title: "Asesoría Experta",
      description: "Equipo profesional con más de 10 años de experiencia en el sector"
    },
    {
      icon: Clock,
      title: "Atención Rápida",
      description: "Respuesta inmediata y seguimiento personalizado en cada etapa"
    }
  ];

  const stats = [
    {
      icon: HomeIcon,
      number: "120+",
      label: "Propiedades Disponibles",
      description: "En las mejores zonas de Xela",
      color: "text-naranja"
    },
    {
      icon: Users,
      number: "300+",
      label: "Clientes Satisfechos",
      description: "Familias con hogar propio",
      color: "text-rojo-naranja"
    },
    {
      icon: TrendingUp,
      number: "10+",
      label: "Años de Experiencia",
      description: "Líderes en el mercado",
      color: "text-amarillo-dorado"
    }
  ];

  const achievements = [
    {
      icon: Award,
      text: "Mejor Inmobiliaria 2024"
    },
    {
      icon: Star,
      text: "4.9/5 Calificación de Clientes"
    },
    {
      icon: BadgeCheck,
      text: "100% Transacciones Seguras"
    }
  ];

  return (
    <main className="space-y-0">
      <Hero />

      {/* SECCIÓN DE SERVICIOS */}
      <section className="py-10 bg-gris-claro">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gris-oscuro mb-4">
              ¿Por Qué Elegir{' '}
              <span 
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FF8C00, #E04A1F)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Multinmuebles
              </span>
              ?
            </h2>
            <p className="text-gris-oscuro/70 text-lg max-w-3xl mx-auto">
              Somos líderes en bienes raíces en Quetzaltenango. Tu confianza y satisfacción son nuestra prioridad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index}
                  className="card-service p-8 rounded-2xl shadow-lg hover:shadow-2xl group"
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-cta rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-naranja">
                      <Icon className="w-8 h-8 text-blanco" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gris-oscuro mb-3 text-center">
                    {service.title}
                  </h3>
                  <p className="text-gris-oscuro/70 text-center leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROPIEDADES DESTACADAS */}
      <section className="py-0 bg-blanco">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-naranja/10 border border-naranja/30 rounded-full px-6 py-2 mb-6">
              <HomeIcon className="w-5 h-5 text-naranja" />
              <span className="text-naranja font-semibold text-sm">
                Nuestro Catálogo
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gris-oscuro mb-4">
              Propiedades <span className="text-naranja">Destacadas</span>
            </h2>
            <p className="text-gris-oscuro/70 text-lg max-w-2xl mx-auto">
              Descubre las mejores opciones inmobiliarias en Quetzaltenango.
              Propiedades seleccionadas especialmente para ti.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-naranja" />
              <span className="ml-4 text-gris-oscuro text-lg">Cargando propiedades...</span>
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gris-oscuro/70">No hay propiedades disponibles en este momento</p>
              <Link href="/contacto">
                <button className="mt-6 btn-cta px-6 py-3 rounded-lg font-semibold shadow-naranja">
                  Contáctanos para más información
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              <div className="text-center">
                <Link href="/propiedades">
                  <button className="btn-cta px-10 py-4 rounded-xl font-bold text-lg shadow-rojo-naranja hover:scale-105 transition-transform inline-flex items-center gap-3 group">
                    Ver Todas las Propiedades
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-amarillo-dorado rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blanco rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          
          {/* Título de sección */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-blanco mb-4">
              Números que Hablan por Nosotros
            </h2>
            <p className="text-blanco/80 text-lg max-w-2xl mx-auto">
              Años de experiencia y cientos de familias satisfechas respaldan nuestro compromiso
            </p>
          </div>

          {/* Grid de estadísticas con Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={index}
                  className="bg-blanco/10 backdrop-blur-xl border-2 border-blanco/20 hover:border-amarillo-dorado hover:bg-blanco/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                >
                  <CardContent className="p-8 text-center">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-20 h-20 bg-blanco/20 backdrop-blur-lg rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-10 h-10 text-amarillo-dorado" />
                      </div>
                    </div>
                    
                    <p className="text-6xl font-extrabold text-amarillo-dorado mb-3 group-hover:scale-110 transition-transform">
                      {stat.number}
                    </p>
                    
                    <p className="text-blanco text-xl font-semibold mb-2">
                      {stat.label}
                    </p>
                    
                    <p className="text-blanco/70 text-sm">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA CONTACTO */}
      <section className="py-20 bg-blanco">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gris-claro to-blanco border-4 border-naranja rounded-3xl p-12 shadow-2xl text-center">
            
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-cta rounded-full mb-8 shadow-naranja">
              <Phone className="w-10 h-10 text-blanco" />
            </div>

            <h3 className="text-3xl md:text-5xl font-bold text-gris-oscuro mb-6">
              ¿No encuentras lo que <span className="text-naranja">buscas</span>?
            </h3>
            
            <p className="text-gris-oscuro/70 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Nuestro equipo te ayudará a encontrar la propiedad perfecta.
              Contáctanos y recibe atención personalizada sin compromiso.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contacto">
                <button className="btn-cta px-10 py-4 rounded-xl font-bold text-lg shadow-rojo-naranja hover:scale-105 transition-transform inline-flex items-center gap-3">
                  <Phone className="w-6 h-6" />
                  Contactar Ahora
                </button>
              </Link>

              <a 
                href="https://wa.me/50240000000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 rounded-xl font-bold text-lg bg-blanco border-3 border-naranja text-naranja hover:bg-naranja hover:text-blanco transition-all shadow-lg inline-flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-naranja flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gris-oscuro">Asesoría Gratuita</p>
                  <p className="text-sm text-gris-oscuro/70">Sin compromisos ni costos ocultos</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-naranja flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gris-oscuro">Respuesta Inmediata</p>
                  <p className="text-sm text-gris-oscuro/70">Atención en menos de 24 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-naranja flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gris-oscuro">Procesos Seguros</p>
                  <p className="text-sm text-gris-oscuro/70">Gestión legal completa</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}