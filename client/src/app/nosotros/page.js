'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Award, 
  Target, 
  Eye, 
  Users, 
  TrendingUp, 
  Home, 
  Shield, 
  Clock, 
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Handshake,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NosotrosPage() {

  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

  const teamMembers = [
    {
      id: 1,
      name: "Licda. Ana del Carmen López",
      role: "Gerente General",
      image: "/images/Nosotros-1.webp",
      description: "Especialista en propiedades comerciales"
    },
    {
      id: 2,
      name: "Oscar Roman Carlos Schaad",
      role: "Gerente General",
      image: "/images/Hero.webp",
      description: "Especialista en propiedades comerciales"
    },
  ];

  const nextSlide = () => {
    setCurrentTeamIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentTeamIndex((prev) =>
      prev === 0 ? teamMembers.length - 1 : prev - 1
    );
  };

  // Determinar cuántos miembros mostrar según la cantidad total
  const getVisibleCount = () => {
    if (teamMembers.length === 1) return 1;
    if (teamMembers.length <= 3) return 2;
    return 4;
  };

  const visibleMembers = getVisibleCount();
  const getVisibleIndex = (offset) => (currentTeamIndex + offset) % teamMembers.length;

  
  const stats = [
    {
      icon: Home,
      number: "120+",
      label: "Propiedades Vendidas",
      color: "text-naranja"
    },
    {
      icon: Users,
      number: "300+",
      label: "Familias Satisfechas",
      color: "text-rojo-naranja"
    },
    {
      icon: TrendingUp,
      number: "10+",
      label: "Años de Experiencia",
      color: "text-amarillo-dorado"
    },
    {
      icon: Award,
      number: "98%",
      label: "Satisfacción del Cliente",
      color: "text-naranja"
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Transparencia",
      description: "Procesos claros y honestos en cada transacción. Sin letra pequeña ni sorpresas."
    },
    {
      icon: Handshake,
      title: "Confianza",
      description: "Construimos relaciones duraderas basadas en la confianza mutua y el profesionalismo."
    },
    {
      icon: CheckCircle,
      title: "Compromiso",
      description: "Dedicados a encontrar la solución perfecta para cada cliente y su familia."
    },
    {
      icon: Target,
      title: "Excelencia",
      description: "Búsqueda constante de la calidad en nuestro servicio y atención al cliente."
    }
  ];

  return (
    <div className="min-h-screen bg-gris-claro">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-primary text-blanco py-20 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-amarillo-dorado rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blanco rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 bg-blanco/10 backdrop-blur-md border border-amarillo-dorado/30 rounded-full px-6 py-2 mb-6">
              <Users className="w-5 h-5 text-amarillo-dorado" />
              <span className="text-blanco font-semibold text-sm">
                Conócenos
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Sobre{' '}
              <span className="text-amarillo-dorado">Multinmuebles</span>
            </h1>
            
            <p className="text-xl text-blanco/90 leading-relaxed max-w-3xl mx-auto">
              Somos una empresa guatemalteca especializada en bienes raíces, 
              comprometida con ayudar a familias a encontrar su hogar ideal 
              en Quetzaltenango y sus alrededores.
            </p>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="py-16 bg-blanco">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={index}
                  className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group"
                >
                  <CardContent className="p-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-cta rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-naranja">
                        <Icon className="w-8 h-8 text-blanco" />
                      </div>
                    </div>
                    
                    <p className="text-4xl font-extrabold text-naranja mb-2 group-hover:scale-110 transition-transform">
                      {stat.number}
                    </p>
                    
                    <p className="text-gris-oscuro font-semibold text-sm">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="py-20 bg-gris-claro">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gris-oscuro mb-4">
              Nuestra <span className="text-naranja">Filosofía</span>
            </h2>
            <p className="text-gris-oscuro/70 text-lg max-w-3xl mx-auto">
              Guiados por principios sólidos que definen nuestro compromiso con cada cliente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            
            {/* MISIÓN */}
            <Card className="border-2 border-naranja/30 hover:border-naranja transition-all hover:shadow-2xl group">
              <CardContent className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-cta rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-naranja">
                    <Target className="w-8 h-8 text-blanco" />
                  </div>
                  <h3 className="text-3xl font-bold text-gris-oscuro">Misión</h3>
                </div>
                
                <p className="text-gris-oscuro/80 leading-relaxed text-lg">
                  Facilitar el acceso a propiedades de calidad en Quetzaltenango, 
                  brindando asesoría profesional, transparencia en cada proceso y 
                  acompañamiento integral para que cada familia encuentre su hogar soñado.
                </p>
              </CardContent>
            </Card>

            {/* VISIÓN */}
            <Card className="border-2 border-amarillo-dorado/30 hover:border-amarillo-dorado transition-all hover:shadow-2xl group">
              <CardContent className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amarillo-dorado to-naranja rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Eye className="w-8 h-8 text-blanco" />
                  </div>
                  <h3 className="text-3xl font-bold text-gris-oscuro">Visión</h3>
                </div>
                
                <p className="text-gris-oscuro/80 leading-relaxed text-lg">
                  Ser la inmobiliaria líder y más confiable de Guatemala, reconocida 
                  por nuestra excelencia en el servicio, innovación tecnológica y 
                  compromiso genuino con el bienestar de nuestros clientes.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* VALORES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={index}
                  className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group"
                >
                  <CardContent className="p-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-naranja/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-naranja" />
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-bold text-gris-oscuro mb-3">
                      {value.title}
                    </h4>
                    
                    <p className="text-gris-oscuro/70 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="py-20 bg-blanco">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gris-oscuro mb-4">
              ¿Por Qué Elegir <span className="text-naranja">Multinmuebles</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            <Card className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-cta rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-7 h-7 text-blanco" />
                  </div>
                  <h3 className="text-xl font-bold text-gris-oscuro">
                    Procesos Seguros
                  </h3>
                </div>
                <p className="text-gris-oscuro/70 leading-relaxed">
                  Gestión legal completa y transparente. Cada transacción está respaldada 
                  por profesionales expertos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-cta rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="w-7 h-7 text-blanco" />
                  </div>
                  <h3 className="text-xl font-bold text-gris-oscuro">
                    Atención Rápida
                  </h3>
                </div>
                <p className="text-gris-oscuro/70 leading-relaxed">
                  Respuesta inmediata a tus consultas. Seguimiento personalizado 
                  en cada etapa del proceso.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-cta rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Home className="w-7 h-7 text-blanco" />
                  </div>
                  <h3 className="text-xl font-bold text-gris-oscuro">
                    Amplio Catálogo
                  </h3>
                </div>
                <p className="text-gris-oscuro/70 leading-relaxed">
                  Más de 120 propiedades verificadas en las mejores zonas de 
                  Quetzaltenango.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-cta rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-blanco" />
                  </div>
                  <h3 className="text-xl font-bold text-gris-oscuro">
                    Asesoría Experta
                  </h3>
                </div>
                <p className="text-gris-oscuro/70 leading-relaxed">
                  Equipo profesional con más de 10 años de experiencia en el 
                  sector inmobiliario.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-cta rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-7 h-7 text-blanco" />
                  </div>
                  <h3 className="text-xl font-bold text-gris-oscuro">
                    Sin Comisiones Ocultas
                  </h3>
                </div>
                <p className="text-gris-oscuro/70 leading-relaxed">
                  Precios claros y transparentes. Sin sorpresas ni costos adicionales 
                  inesperados.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-cta rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-7 h-7 text-blanco" />
                  </div>
                  <h3 className="text-xl font-bold text-gris-oscuro">
                    Conocemos Xela
                  </h3>
                </div>
                <p className="text-gris-oscuro/70 leading-relaxed">
                  Expertos locales que conocen cada zona, ventajas y oportunidades 
                  de la región.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

     {/* EQUIPO - CARRUSEL RESPONSIVE */}
<section className="py-20 bg-blanco">
  <div className="container mx-auto px-4">
    
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gris-oscuro mb-4">
        Nuestro Equipo De Trabajo
      </h2>
      <p className="text-gris-oscuro/70 text-lg">
        Profesionales dedicados a tu satisfacción
      </p>
    </div>

    {/* CARRUSEL - DISEÑO MEJORADO */}
    <div className="max-w-6xl mx-auto">
      
      {/* Tarjeta del miembro actual */}
      <Card className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group overflow-hidden bg-transparent shadow-lg">
        <CardContent className="p-0">
          
          {/* Container principal - Más ancho */}
          <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gris-claro">
            {/* Contenedor de imagen con márgenes laterales */}
            <div className="relative w-full h-full max-w-4xl mx-auto px-4 md:px-8">
              <Image
                src={teamMembers[currentTeamIndex].image}
                alt={teamMembers[currentTeamIndex].name}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                style={{ objectPosition: 'center 20%' }}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
                }}
              />
              
              {/* Overlay gradiente sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              
              {/* Overlay hover */}
              <div className="absolute inset-0 bg-naranja/0 group-hover:bg-naranja/5 transition-all duration-500" />
            </div>

            {/* Controles - Solo si hay más de 1 miembro */}
            {teamMembers.length > 1 && (
              <>
                {/* Botón anterior - Izquierda */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-blanco/90 hover:bg-blanco border-2 border-naranja hover:border-naranja transition-all flex items-center justify-center group/btn shadow-lg z-10"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-naranja group-hover/btn:scale-125 transition-transform" />
                </button>

                {/* Botón siguiente - Derecha */}
                <button
                  onClick={nextSlide}
                  className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-blanco/90 hover:bg-blanco border-2 border-naranja hover:border-naranja transition-all flex items-center justify-center group/btn shadow-lg z-10"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-naranja group-hover/btn:scale-125 transition-transform" />
                </button>

                {/* Indicadores - Abajo al centro */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-blanco/80 backdrop-blur-md rounded-full px-4 py-3 z-10">
                  {teamMembers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTeamIndex(index)}
                      className={`rounded-full transition-all ${
                        index === currentTeamIndex
                          ? 'bg-naranja w-3 h-3'
                          : 'bg-gris-medio hover:bg-gris-oscuro w-2 h-2'
                      }`}
                      aria-label={`Ir al miembro ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Información del miembro - Rediseñada */}
          <div className="p-6 md:p-10 text-center bg-gradient-to-b from-blanco to-gris-claro/50">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-4xl font-bold text-gris-oscuro mb-3">
                {teamMembers[currentTeamIndex].name}
              </h3>
              
              <div className="inline-flex items-center gap-2 bg-naranja/10 text-naranja font-semibold text-sm md:text-lg px-6 py-2 rounded-full mb-4">
                <span className="w-2 h-2 bg-naranja rounded-full"></span>
                {teamMembers[currentTeamIndex].role}
              </div>
              
              <p className="text-gris-oscuro/70 text-base md:text-lg leading-relaxed">
                {teamMembers[currentTeamIndex].description}
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>

    {/* Información adicional del equipo */}
    <div className="max-w-3xl mx-auto mt-12 text-center">
      <p className="text-gris-oscuro/60 text-sm md:text-base">
        Nuestro equipo combina experiencia local con atención personalizada para 
        ofrecerte el mejor servicio inmobiliario en Quetzaltenango.
      </p>
    </div>

  </div>
</section>

      {/* CTA FINAL */}
      <section className="py-6 bg-gradient-primary text-blanco">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blanco/20 backdrop-blur-lg rounded-full mb-8">
              <Phone className="w-10 h-10 text-amarillo-dorado" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              ¿Listo para encontrar tu <span className="text-amarillo-dorado">hogar ideal</span>?
            </h2>
            
            <p className="text-xl text-blanco/90 mb-10 max-w-2xl mx-auto">
              Contáctanos hoy y déjanos ayudarte a hacer realidad el sueño de tu 
              propiedad perfecta en Quetzaltenango.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacto">
                <Button className="btn-secondary px-10 py-6 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6 mr-2" />
                  Contáctanos
                </Button>
              </Link>

              <Link href="/propiedades">
                <Button 
                  variant="outline"
                  className="px-10 py-6 rounded-xl font-bold text-lg bg-blanco/10 backdrop-blur-lg border-2 border-blanco text-blanco hover:bg-blanco hover:text-naranja transition-all shadow-xl"
                >
                  <Home className="w-6 h-6 mr-2" />
                  Ver Propiedades
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}