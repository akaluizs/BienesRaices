import { Users, Target, Award, Heart } from 'lucide-react';

export default function NosotrosPage() {
  const values = [
    {
      icon: Target,
      title: 'Transparencia',
      description: 'Procesos claros y honestos en cada transacción inmobiliaria.',
    },
    {
      icon: Heart,
      title: 'Confianza',
      description: 'Somos tu socio en la búsqueda del hogar de tus sueños.',
    },
    {
      icon: Award,
      title: 'Excelencia',
      description: 'Servicio de calidad premium con atención personalizada.',
    },
    {
      icon: Users,
      title: 'Comunidad',
      description: 'Trabajamos por el desarrollo inmobiliario de Quetzaltenango.',
    },
  ];

  const team = [
    {
      id: 1,
      name: 'Carlos Mendez',
      position: 'Gerente General',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      description: '20 años de experiencia en bienes raíces',
    },
    {
      id: 2,
      name: 'María López',
      position: 'Asesora Inmobiliaria',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      description: 'Especialista en propiedades residenciales',
    },
    {
      id: 3,
      name: 'Juan García',
      position: 'Asesor Legal',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      description: 'Abogado especializado en derecho inmobiliario',
    },
  ];

  return (
    <main className="body-theme">
      {/* HERO NOSOTROS */}
      <section className="hero-theme py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-niebla mb-6">
            Sobre Nosotros
          </h1>
          <p className="text-lg md:text-xl text-niebla/90 max-w-3xl mx-auto">
            Más de una década sirviendo a la comunidad de Quetzaltenango en bienes raíces
          </p>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* TEXTO */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-xela-navy mb-6">
                ¿Quiénes Somos?
              </h2>
              <p className="text-granito text-lg mb-4 leading-relaxed">
                BienesRaíces es una empresa especializada en la compra, venta y alquiler de propiedades
                en Quetzaltenango y sus alrededores. Con más de 10 años de experiencia, hemos ayudado
                a cientos de familias a encontrar su hogar ideal.
              </p>
              <p className="text-granito text-lg mb-4 leading-relaxed">
                Nuestro equipo está compuesto por profesionales capacitados en derecho inmobiliario,
                tasación de propiedades y atención al cliente. Nos comprometemos a ofrecerte las mejores
                opciones del mercado con transparencia y ética.
              </p>
              <p className="text-granito text-lg leading-relaxed">
                Creemos que cada cliente merece un servicio personalizado y de calidad. Tu satisfacción
                es nuestro mayor logro.
              </p>
            </div>

            {/* IMAGEN */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop"
                  alt="Equipo BienesRaíces"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-cerro-verde text-white p-6 rounded-2xl shadow-lg">
                <p className="text-3xl font-bold">10+</p>
                <p className="text-sm">Años de experiencia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-20 bg-niebla">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-xela-navy text-center mb-12">
            Nuestros Valores
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-xl transition-shadow"
                >
                  <Icon className="w-12 h-12 text-cerro-verde mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-xela-navy mb-3">
                    {value.title}
                  </h3>
                  <p className="text-granito text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-xela-navy mb-4">
            ¿Listo para encontrar tu propiedad?
          </h2>
          <p className="text-granito text-lg mb-8 max-w-2xl mx-auto">
            Contáctanos hoy y déjate guiar por nuestro equipo profesional
          </p>
          <a
            href="/contacto"
            className="inline-block bg-cerro-verde hover:bg-xela-navy text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300 group inline-flex items-center gap-2"
          >
            Contáctanos Ahora
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}