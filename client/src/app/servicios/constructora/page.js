'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  Download,
  X,
  Building2,
  Hammer,
  Home,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Eye,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export default function ConstructoraPage() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [pdfZoom, setPdfZoom] = useState(100);

  // Imágenes del Hero
  const heroImages = [
    {
      id: 1,
      type: 'hero-with-content',
      src: "/images/hero-bg.avif",
      alt: "Constructora Armado - Proyectos de construcción",
      width: 1920,
      height: 850,
      bgColor: '#01155E'
    },
    {
      id: 2,
      type: 'hero-image-only',
      src: "/images/Constructora.webp",
      alt: "Constructora Armado - Obras realizadas",
      width: 1920,
      height: 850
    },
  ];

  // Servicios
  const services = [
    {
      icon: Building2,
      title: 'Construcción Nueva',
      description: 'Proyectos residenciales y comerciales desde cero con máximos estándares de calidad',
      color: 'text-naranja'
    },
    {
      icon: Hammer,
      title: 'Remodelación',
      description: 'Transformación integral de espacios existentes modernizando y optimizando',
      color: 'text-rojo-naranja'
    },
    {
      icon: Home,
      title: 'Desarrollo Inmobiliario',
      description: 'Proyectos de vivienda y comercio con visión de inversión y rentabilidad',
      color: 'text-amarillo-dorado'
    },
    {
      icon: Users,
      title: 'Asesoría Profesional',
      description: 'Equipo especializado para guiarte en cada fase de tu proyecto constructivo',
      color: 'text-naranja'
    },
  ];

  // Valores
  const values = [
    {
      icon: Award,
      title: 'Calidad Garantizada',
      description: 'Materiales premium y acabados de excelencia'
    },
    {
      icon: CheckCircle,
      title: 'Puntualidad',
      description: 'Cumplimiento de tiempos y plazos convenidos'
    },
    {
      icon: Users,
      title: 'Comunicación Directa',
      description: 'Seguimiento constante y transparencia total'
    },
  ];

  const portfolioPdfUrl = '/pdfs/portafolio-constructora-armado.pdf';

  // Auto-rotación cada 15 segundos
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 15000);
    
    return () => clearInterval(interval);
  }, [isAutoPlay, heroImages.length]);

  // Reanudar autoplay después de 10 segundos de inactividad
  useEffect(() => {
    if (isAutoPlay) return;

    const timeout = setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isAutoPlay, currentHeroIndex]);

  // Bloquear scroll cuando modal PDF está abierto
  useEffect(() => {
    if (showPdfModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPdfModal]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showPdfModal) return;

      if (e.key === 'Escape') closePdf();
      if (e.ctrlKey && e.key === '+') {
        e.preventDefault();
        zoomInPdf();
      }
      if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        zoomOutPdf();
      }
      if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showPdfModal, pdfZoom]);

  const nextSlide = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentHeroIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
    setIsAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentHeroIndex(index);
    setIsAutoPlay(false);
  };

  const openPdf = () => {
    setShowPdfModal(true);
    setPdfZoom(100);
  };

  const closePdf = () => {
    setShowPdfModal(false);
    setPdfZoom(100);
  };

  const zoomInPdf = () => {
    setPdfZoom(prev => Math.min(prev + 10, 300));
  };

  const zoomOutPdf = () => {
    setPdfZoom(prev => Math.max(prev - 10, 50));
  };

  const resetZoom = () => {
    setPdfZoom(100);
  };

  const currentImage = heroImages[currentHeroIndex];
  const aspectRatio = currentImage.width / currentImage.height;
  const heightPercentage = (1 / aspectRatio) * 100;

  return (
    <div className="min-h-screen bg-gris-claro">
      
      {/* HERO SECTION - CARRUSEL DUAL */}
      <section className={`relative w-full overflow-hidden transition-all duration-300 ${showPdfModal ? 'blur-sm scale-95' : ''}`} style={{ backgroundColor: currentImage.bgColor || '#ffffff' }}>
        
        <div 
          className="relative w-full"
          style={{ 
            paddingBottom: `${heightPercentage}%`,
            maxHeight: '90vh'
          }}
        >
          {/* Imágenes con transición */}
          {heroImages.map((image, index) => {
            const imgAspectRatio = image.width / image.height;
            const imgHeightPercentage = (1 / imgAspectRatio) * 100;
            
            return (
              <div
                key={image.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="absolute inset-0">
                  {/* IMAGEN DE FONDO */}
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={index === 0}
                    className={`object-cover transition-transform duration-1000 ${
                      index === currentHeroIndex ? 'scale-100' : 'scale-105'
                    }`}
                    quality={95}
                    sizes="100vw"
                    onError={(e) => {
                      e.target.style.backgroundColor = image.bgColor || '#FF8C00';
                    }}
                  />
                  
                  {/* OVERLAYS - Solo para la imagen 1 (con contenido) */}
                  {image.type === 'hero-with-content' && (
                    <div className="absolute inset-0 bg-azul-oscuro/10"></div>
                  )}

                  {/* OVERLAY PARA IMAGEN 2 */}
                  {image.type === 'hero-image-only' && (
                    <div className="absolute inset-0 bg-black/10" />
                  )}
                </div>
              </div>
            );
          })}

          {/* CONTENIDO PRINCIPAL - Texto y CTA (SOLO PARA IMAGEN 1) */}
          {currentImage.type === 'hero-with-content' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 md:p-8 animate-fade-in">
              <div className="text-center text-blanco max-w-4xl mx-auto space-y-3 md:space-y-4">
                
                {/* Logo/Nombre - Responsive */}
                <div className="space-y-1 md:space-y-2 drop-shadow-2xl">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                    Constructora <br className="md:hidden" />
                    <span className="text-amarillo-dorado">ARMADO</span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-2xl lg:text-4xl font-bold italic px-2">
                    "Más que obras, somos tu respaldo."
                  </p>
                </div>

                {/* Botones CTA - Responsive */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center pt-3 md:pt-6 px-2">
                  <Link href="#servicios" className="w-full sm:w-auto">
                    <Button className="btn-cta w-full px-6 md:px-10 py-2.5 md:py-6 text-xs sm:text-sm md:text-base lg:text-lg font-bold rounded-lg md:rounded-xl shadow-naranja hover:scale-105 transition-transform">
                      Ver Servicios
                    </Button>
                  </Link>

                  <button
                    onClick={openPdf}
                    className="w-full sm:w-auto px-6 md:px-10 py-2.5 md:py-6 text-xs sm:text-sm md:text-base lg:text-lg font-bold bg-blanco/10 backdrop-blur-lg border-2 border-blanco text-blanco hover:bg-blanco hover:text-naranja rounded-lg md:rounded-xl transition-all flex items-center justify-center gap-1 md:gap-2"
                  >
                    <FileText className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden xs:inline">Ver Portafolio</span>
                    <span className="xs:hidden">Portafolio</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CONTROLES DEL CARRUSEL - INTEGRADOS */}
          {heroImages.length > 1 && (
            <>
              {/* Botón anterior */}
              <button
                onClick={prevSlide}
                onMouseEnter={() => setIsAutoPlay(false)}
                onMouseLeave={() => setIsAutoPlay(true)}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-blanco/90 hover:bg-blanco border-2 border-naranja hover:border-naranja transition-all flex items-center justify-center group shadow-lg z-20 hover:scale-110"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-naranja group-hover:scale-125 transition-transform" />
              </button>

              {/* Botón siguiente */}
              <button
                onClick={nextSlide}
                onMouseEnter={() => setIsAutoPlay(false)}
                onMouseLeave={() => setIsAutoPlay(true)}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-blanco/90 hover:bg-blanco border-2 border-naranja hover:border-naranja transition-all flex items-center justify-center group shadow-lg z-20 hover:scale-110"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-naranja group-hover:scale-125 transition-transform" />
              </button>

              {/* Indicadores de puntos - Abajo al centro */}
              <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-blanco/80 backdrop-blur-md rounded-full px-4 py-3 z-20">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    onMouseEnter={() => setIsAutoPlay(false)}
                    onMouseLeave={() => setIsAutoPlay(true)}
                    className={`rounded-full transition-all ${
                      index === currentHeroIndex
                        ? 'w-3 h-3 bg-naranja'
                        : 'w-2 h-2 bg-gris-medio hover:bg-gris-oscuro'
                    }`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>

              {/* Contador - Desktop only */}
              <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 bg-blanco/90 backdrop-blur-md rounded-full px-4 py-2 text-gris-oscuro font-bold z-20 hidden md:block shadow-lg">
                <span className="text-naranja">{currentHeroIndex + 1}</span>
                <span className="text-gris-oscuro/70"> / {heroImages.length}</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* SECCIÓN SOBRE NOSOTROS */}
      <section className="py-20 bg-blanco">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Texto */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gris-oscuro mb-4">
                  Sobre <span className="text-naranja">Constructora Armado</span>
                </h2>
                <div className="w-20 h-1 bg-gradient-cta rounded-full"></div>
              </div>

              <p className="text-gris-oscuro/80 text-lg leading-relaxed">
                Brindamos a cada cliente la seguridad de una inversión sólida y confiable. 
                Nuestro compromiso es transformar ideas en realidades constructivas.
              </p>

              <p className="text-gris-oscuro/80 text-lg leading-relaxed">
                Nuestra prioridad es generar <span className="font-bold text-naranja">confianza y cercanía</span>, 
                ofreciendo un servicio profesional pero también familiar, donde cada detalle se construye 
                pensando en tu tranquilidad y en el valor a largo plazo de tu patrimonio.
              </p>

              <div className="pt-6 flex gap-4 flex-wrap">
                <button
                  onClick={openPdf}
                  className="btn-cta px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Eye className="w-5 h-5" />
                  Ver Portafolio
                </button>

                <a
                  href={portfolioPdfUrl}
                  download
                  className="px-8 py-3 bg-gris-claro text-gris-oscuro font-bold rounded-lg hover:bg-naranja/10 hover:text-naranja transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Descargar PDF
                </a>
              </div>
            </div>

            {/* Grid de valores */}
            <div className="grid grid-cols-1 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card 
                    key={index}
                    className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-cta rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-naranja">
                          <Icon className="w-6 h-6 text-blanco" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gris-oscuro mb-2">
                            {value.title}
                          </h3>
                          <p className="text-gris-oscuro/70">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="py-20 bg-gris-claro">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gris-oscuro mb-4">
              Nuestros <span className="text-naranja">Servicios</span>
            </h2>
            <p className="text-gris-oscuro/70 text-lg max-w-2xl mx-auto">
              Soluciones constructivas integrales para tus proyectos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={index}
                  className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group"
                >
                  <CardContent className="p-8 text-center">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-naranja/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className={`w-8 h-8 ${service.color}`} />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gris-oscuro mb-3">
                      {service.title}
                    </h3>
                    
                    <p className="text-gris-oscuro/70 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* PORTAFOLIO - ÚNICO PDF */}
      <section id="portafolio" className="py-20 bg-blanco">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gris-oscuro mb-4">
              Portafolio de <span className="text-naranja">Proyectos</span>
            </h2>
            <p className="text-gris-oscuro/70 text-lg max-w-2xl mx-auto">
              Revisa nuestro completo portafolio de proyectos realizados
            </p>
          </div>

          {/* Card principal del PDF */}
          <Card className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              
              {/* Imagen/Icono grande */}
              <div className="w-full h-64 bg-gradient-to-br from-naranja/30 to-amarillo-dorado/30 flex flex-col items-center justify-center group hover:from-naranja/40 hover:to-amarillo-dorado/40 transition-all">
                <FileText className="w-24 h-24 text-naranja mb-4" />
                <p className="text-gris-oscuro font-semibold text-lg">Portafolio Completo</p>
              </div>

              {/* Contenido */}
              <div className="p-10 text-center space-y-6">
                
                <div>
                  <h3 className="text-3xl font-bold text-gris-oscuro mb-2">
                    Portafolio de Proyectos
                  </h3>
                  <p className="text-gris-oscuro/70 text-lg">
                    Descubre todos nuestros proyectos de construcción, remodelación y desarrollo inmobiliario
                  </p>
                </div>

                <div className="bg-amarillo-dorado/10 border-2 border-amarillo-dorado rounded-xl p-6">
                  <p className="text-gris-oscuro font-semibold mb-2">
                    Documento PDF Completo
                  </p>
                  <p className="text-gris-oscuro/70 text-sm">
                    Contiene toda la información detallada de nuestros proyectos realizados
                  </p>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <button
                    onClick={openPdf}
                    className="px-8 py-4 bg-gradient-cta text-blanco font-bold rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-naranja flex-1"
                  >
                    <Eye className="w-5 h-5" />
                    Ver PDF
                  </button>
                  <a
                    href={portfolioPdfUrl}
                    download="portafolio-constructora-armado.pdf"
                    className="px-8 py-4 bg-gris-claro text-gris-oscuro font-bold rounded-xl hover:bg-naranja/10 hover:text-naranja transition-all flex items-center justify-center gap-2 flex-1"
                  >
                    <Download className="w-5 h-5" />
                    Descargar
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* MODAL PDF - PANTALLA COMPLETA */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-negro/95 backdrop-blur-md z-[9999] flex flex-col animate-in fade-in duration-300">
          
          {/* HEADER - Toolbar */}
          <div className="bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 md:p-6 border-b border-white/10">
            <div className="container mx-auto flex items-center justify-between">
              
              {/* Título y zoom info */}
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-md text-blanco px-4 py-2 rounded-full font-bold text-sm border border-white/20">
                  Zoom: <span className="text-naranja ml-2">{pdfZoom}%</span>
                </div>
                <h3 className="text-white font-bold text-lg hidden md:block">
                  Portafolio - Constructora Armado
                </h3>
              </div>

              {/* Botones de control */}
              <div className="flex items-center gap-3">
                
                {/* Zoom Out */}
                <button
                  onClick={zoomOutPdf}
                  disabled={pdfZoom <= 50}
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-all border border-white/20 tooltip"
                  title="Alejar (Ctrl + -)"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>

                {/* Reset Zoom */}
                <button
                  onClick={resetZoom}
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2.5 rounded-lg transition-all text-sm font-bold border border-white/20"
                  title="Restablecer zoom"
                >
                  100%
                </button>

                {/* Zoom In */}
                <button
                  onClick={zoomInPdf}
                  disabled={pdfZoom >= 300}
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-all border border-white/20"
                  title="Ampliar (Ctrl + +)"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>

                {/* Descargar */}
                <a
                  href={portfolioPdfUrl}
                  download="portafolio-constructora-armado.pdf"
                  className="bg-naranja hover:bg-rojo-naranja text-blanco p-2.5 rounded-lg transition-all flex items-center justify-center border border-naranja/30"
                  title="Descargar PDF"
                >
                  <Download className="w-5 h-5" />
                </a>

                {/* Cerrar */}
                <button
                  onClick={closePdf}
                  className="bg-white/10 backdrop-blur-md hover:bg-rojo-naranja text-white p-2.5 rounded-lg transition-all border border-white/20 ml-2"
                  title="Cerrar (ESC)"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* IFRAME - Contenedor PDF - AMPLIADO */}
          <div className="flex-1 overflow-auto bg-black/50 p-0 flex items-start justify-center">
            <iframe
              src={`${portfolioPdfUrl}#toolbar=0&navpanes=0&view=FitW`}
              className="w-full h-full"
              style={{ 
                minHeight: '100%',
                border: 'none'
              }}
              title="Portafolio PDF"
            />
          </div>

          {/* FOOTER - Info */}
          <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 md:p-6 border-t border-white/10">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-white text-sm gap-4">
              <p className="text-white/70">
                Usa <kbd className="bg-white/10 px-2 py-1 rounded text-xs font-bold ml-2">Ctrl</kbd> + 
                <kbd className="bg-white/10 px-2 py-1 rounded text-xs font-bold ml-1">+</kbd> y 
                <kbd className="bg-white/10 px-2 py-1 rounded text-xs font-bold ml-1">-</kbd> para zoom
              </p>
              <p className="text-white/70">
                <kbd className="bg-white/10 px-2 py-1 rounded text-xs font-bold">ESC</kbd> para cerrar
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-primary text-blanco">
        <div className="max-w-4xl mx-auto px-4 text-center">
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Tienes un <span className="text-amarillo-dorado">proyecto en mente</span>?
          </h2>
          
          <p className="text-xl text-blanco/90 mb-10 max-w-2xl mx-auto">
            Contáctanos hoy y deja que nuestro equipo de expertos haga realidad tu sueño constructivo
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+50240000000"
              className="px-8 py-4 bg-blanco text-naranja font-bold rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg"
            >
              <Phone className="w-6 h-6" />
              Llamar
            </a>

            <a
              href="mailto:info@constructoraarmado.com"
              className="px-8 py-4 bg-blanco/20 border-2 border-blanco text-blanco font-bold rounded-xl hover:bg-blanco/30 transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-6 h-6" />
              Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}