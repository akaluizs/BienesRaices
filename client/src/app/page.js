import Hero from '@/components/Hero';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';

export default function Home() {
  const featuredProperties = [
    {
      id: 1,
      title: 'Casa Moderna',
      price: 350000,
      location: 'Zona 3, Quetzaltenango',
      description: 'Casa moderna de 3 niveles con parqueo, patio y acabados de lujo',
      image: '/properties/casa-1.jpg',
      area: 120,
      bedrooms: 3,
      bathrooms: 2,
      parking: 1,
      type: 'Casa',
    },
    {
      id: 2,
      title: 'Apartamento Céntrico',
      price: 250000,
      location: 'Centro, Quetzaltenango',
      description: 'Apartamento de 2 habitaciones en ubicación privilegiada y segura',
      image: '/properties/apt-1.jpg',
      area: 85,
      bedrooms: 2,
      bathrooms: 1,
      parking: 1,
      type: 'Apartamento',
    },
    {
      id: 3,
      title: 'Terreno Amplio',
      price: 150000,
      location: 'Zona 5, Quetzaltenango',
      description: 'Terreno de 500 m² ideal para construcción de vivienda o comercio',
      image: '/properties/terreno-1.jpg',
      area: 500,
      bedrooms: null,
      bathrooms: null,
      parking: null,
      type: 'Terreno',
    },
  ];

  return (
    <main>
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