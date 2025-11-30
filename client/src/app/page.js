'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Hero from '@/components/Hero';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

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
        .limit(3);

      if (error) throw error;

      // Transformar datos al formato de PropertyCard
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

  return (
    <main style={{ viewTransitionName: 'main-content' }} className="space-y-8">
      <Hero />

      {/* PROPIEDADES DESTACADAS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* ENCABEZADO */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-xela-navy mb-4">
              Propiedades Destacadas
            </h2>
            <p className="text-granito text-lg max-w-2xl mx-auto">
              Descubre nuestras mejores opciones inmobiliarias en Quetzaltenango.
              Propiedades seleccionadas con cuidado para ti.
            </p>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-cerro-verde" />
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-granito">No hay propiedades disponibles</p>
            </div>
          ) : (
            <>
              {/* GRID DE PROPIEDADES */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* BOTÓN VER MÁS */}
              <div className="text-center">
                <Link href="/propiedades">
                  <button className="inline-block bg-cerro-verde hover:bg-xela-navy text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 group">
                    Ver Todas las Propiedades
                    <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA CONTACTO */}
      <section className="hero-theme py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-niebla mb-4">
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-niebla/80 text-lg mb-8 max-w-xl mx-auto">
            Contáctanos y nuestro equipo te ayudará a encontrar la propiedad perfecta
          </p>
          <Link href="/contacto">
            <button className="bg-arena hover:bg-arena/90 text-xela-navy font-bold py-3 px-8 rounded-lg transition-colors duration-300 group inline-flex items-center">
              Contactar Ahora
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}