'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const heroImages = [
  {
    id: 1,
    type: 'hero-with-content', 
    src: "/images/Hero-Orange.jpg",
    alt: "Propiedades modernas en Quetzaltenango - Multinmuebles",
    width: 2048,
    height: 762
  },
  {
    id: 2,
    type: 'hero-image-only',
    src: "/images/Hero.webp",
    alt: "Casa familiar ideal en las mejores zonas de Xela",
    width: 2048,
    height: 762
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [currentImage, setCurrentImage] = useState(heroImages[0]);

  // Auto-rotación del carrusel cada 5 segundos
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlay]);

  // Actualizar imagen actual cuando cambia el índice
  useEffect(() => {
    setCurrentImage(heroImages[currentIndex]);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  // Reanudar autoplay después de 10 segundos de inactividad
  useEffect(() => {
    if (isAutoPlay) return;

    const timeout = setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isAutoPlay, currentIndex]);

  const aspectRatio = currentImage.width / currentImage.height;
  const heightPercentage = (1 / aspectRatio) * 100;

  return (
    <section className="relative w-full overflow-hidden bg-gris-claro">
      {/* Contenedor principal */}
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
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ paddingBottom: `${imgHeightPercentage}%` }}
            >
              <div className="absolute inset-0">
                {/* IMAGEN DE FONDO */}
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  className={`object-cover transition-transform duration-1000 ${
                    index === currentIndex ? 'scale-100' : 'scale-105'
                  }`}
                  quality={95}
                  sizes="100vw"
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=850&q=80`;
                  }}
                />
                
                {/* OVERLAYS - Solo para la imagen 1 (con contenido) */}
                {image.type === 'hero-with-content' && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-naranja/0 hover:bg-naranja/5 transition-all duration-300" />
                  </>
                )}

                {/* OVERLAY MÁS SUTIL PARA IMAGEN 2 */}
                {image.type === 'hero-image-only' && (
                  <div className="absolute inset-0 bg-black/10" />
                )}
              </div>
            </div>
          );
        })}

        {/* CONTROLES DEL CARRUSEL - INTEGRADOS */}
        {heroImages.length > 1 && (
          <>
            {/* Botón anterior */}
            <button
              onClick={prevSlide}
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-blanco/90 hover:bg-blanco border-2 border-naranja hover:border-naranja transition-all flex items-center justify-center group shadow-lg z-10 hover:scale-110"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-naranja group-hover:scale-125 transition-transform" />
            </button>

            {/* Botón siguiente */}
            <button
              onClick={nextSlide}
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-blanco/90 hover:bg-blanco border-2 border-naranja hover:border-naranja transition-all flex items-center justify-center group shadow-lg z-10 hover:scale-110"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-naranja group-hover:scale-125 transition-transform" />
            </button>

            {/* Indicadores de puntos - Abajo al centro */}
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-blanco/80 backdrop-blur-md rounded-full px-4 py-3 z-10">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  onMouseEnter={() => setIsAutoPlay(false)}
                  onMouseLeave={() => setIsAutoPlay(true)}
                  className={`rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-3 h-3 bg-naranja'
                      : 'w-2 h-2 bg-gris-medio hover:bg-gris-oscuro'
                  }`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* CONTENIDO PRINCIPAL - Texto y CTA (SOLO PARA IMAGEN 1) */}
        {currentImage.type === 'hero-with-content' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-5 p-4">
            <div className="text-center text-blanco max-w-4xl mx-auto space-y-6 animate-fade-in">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blanco/10 backdrop-blur-md border border-amarillo-dorado/30 rounded-full px-6 py-2">
                <span className="w-2 h-2 bg-amarillo-dorado rounded-full"></span>
                <span className="text-amarillo-dorado font-semibold text-sm md:text-base">
                  Encuentra su hogar ideal
                </span>
              </div>

              {/* Título principal */}
              <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold mb-4 drop-shadow-xl leading-tight">
                Su próxima <span className="text-amarillo-dorado">propiedad</span> en Xela
              </h1>

              {/* Subtítulo */}
              <p className="text-lg md:text-2xl text-blanco/90 drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
                Más de <span className="font-bold text-amarillo-dorado">120 propiedades</span> verificadas en las mejores zonas de Quetzaltenango
              </p>

              {/* Botones CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/propiedades">
                  <Button className="btn-cta px-8 md:px-10 py-4 md:py-6 text-base md:text-lg font-bold rounded-xl shadow-naranja hover:scale-105 transition-transform">
                    Ver Propiedades
                  </Button>
                </Link>

                <Link href="/contacto">
                  <Button 
                    variant="outline"
                    className="px-8 md:px-10 py-4 md:py-6 text-base md:text-lg font-bold bg-blanco/10 backdrop-blur-lg border-2 border-blanco text-blanco hover:bg-blanco hover:text-naranja rounded-xl transition-all shadow-lg"
                  >
                    Contáctanos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}