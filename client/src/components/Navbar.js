'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Phone, MapPin, ChevronDown, Home, Key, BarChart3, Scale, Clipboard, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  const handleNavigation = (href) => {
    setIsOpen(false);
    setIsServicesOpen(false);
    
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  };

  const isActive = (href) => pathname === href;

  const navLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Propiedades', href: '/propiedades' },
    { label: 'Anuncios', href: '/anuncios' },
    { label: 'Preventa', href: '/preventa' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Contacto', href: '/contacto' },
  ];

  const serviceItems = [
    {
      label: 'Compra y Venta',
      href: '/servicios/compra-venta',
      icon: Home,
      description: 'Asesoría en compra y venta de propiedades'
    },
    {
      label: 'Arrendamiento',
      href: '/servicios/arrendamiento',
      icon: Key,
      description: 'Gestión de arrendamientos residenciales'
    },
    {
      label: 'Tasación',
      href: '/servicios/tasacion',
      icon: BarChart3,
      description: 'Valuación profesional de inmuebles'
    },
    {
      label: 'Asesoría Legal',
      href: '/servicios/asesoria-legal',
      icon: Scale,
      description: 'Consultoría legal inmobiliaria'
    },
    {
      label: 'Gestión de Propiedades',
      href: '/servicios/gestion-propiedades',
      icon: Clipboard,
      description: 'Administración integral de bienes'
    },
    {
      label: 'Constructora',
      href: '/servicios/constructora',
      icon: TrendingUp,
      description: 'Asesoría en inversión inmobiliaria'
    },
  ];

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-gradient-primary text-blanco py-3 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            
            <div className="flex items-center gap-8">
              <a 
                href="tel:+50240000000" 
                className="flex items-center gap-2 hover:text-amarillo-dorado transition-colors font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>+502 5556 6379</span>
              </a>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Quetzaltenango, Guatemala</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="opacity-90">Lun - Vie: 8:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="bg-blanco shadow-lg border-b-4 border-naranja">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link href="/">
              <div 
                onClick={() => handleNavigation('/')}
                className="cursor-pointer group"
              >
                <h1 className="text-3xl font-extrabold tracking-tight">
                  <span className="text-negro group-hover:text-gris-oscuro transition-colors">
                    Multi
                  </span>
                  <span 
                    className="text-naranja group-hover:text-rojo-naranja transition-colors"
                    style={{
                      background: 'linear-gradient(135deg, #FF8C00, #E04A1F, #FFD700)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    inmuebles
                  </span>
                </h1>
                <p className="text-xs text-gris-oscuro font-medium tracking-wide">
                  TU HOGAR, NUESTRA MISIÓN
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link.href)}
                  className={`relative px-2 py-2 font-semibold transition-all duration-300 group ${
                    isActive(link.href)
                      ? 'text-naranja'
                      : 'text-gris-oscuro hover:text-naranja'
                  }`}
                >
                  {link.label}
                  
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-cta transform origin-left transition-transform duration-300 ${
                      isActive(link.href) 
                        ? 'scale-x-100' 
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>
              ))}

              {/* DROPDOWN SERVICIOS */}
              <div 
                className="relative group"
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  onMouseEnter={() => setIsServicesOpen(true)}
                  className={`flex items-center gap-2 px-2 py-2 font-semibold transition-all duration-300 ${
                    isActive('/servicios') || pathname.startsWith('/servicios/')
                      ? 'text-naranja'
                      : 'text-gris-oscuro hover:text-naranja'
                  }`}
                >
                  Servicios
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isServicesOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Dropdown Menu - BLANCO PURO SIN TRANSPARENCIA */}
                {isServicesOpen && (
                  <div 
                    className="absolute left-0 mt-0 w-96 bg-white border-2 border-gris-medio rounded-2xl shadow-2xl z-50"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <div className="p-6 space-y-4">
                      {serviceItems.map((service) => {
                        const IconComponent = service.icon;
                        return (
                          <button
                            key={service.href}
                            onClick={() => handleNavigation(service.href)}
                            className={`w-full text-left px-4 py-4 rounded-xl transition-all ${
                              isActive(service.href)
                                ? 'bg-gradient-cta text-white shadow-naranja'
                                : 'hover:bg-naranja/10 text-gris-oscuro'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-lg ${isActive(service.href) ? 'bg-white/20' : 'bg-naranja/20'}`}>
                                <IconComponent className={`w-5 h-5 ${isActive(service.href) ? 'text-white' : 'text-naranja'}`} />
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-bold text-base transition-colors ${
                                  isActive(service.href) ? 'text-white' : 'text-gris-oscuro'
                                }`}>
                                  {service.label}
                                </h4>
                                <p className={`text-sm mt-1 transition-colors ${
                                  isActive(service.href) ? 'text-white/90' : 'text-gris-oscuro/70'
                                }`}>
                                  {service.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button Desktop */}
            <div className="hidden lg:block">
              <a
                href="https://wa.me/50240000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 shadow-naranja hover:scale-105 transition-transform"
              >
                <Phone className="w-4 h-4" />
                ¡Contáctanos!
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gris-claro transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-7 h-7 text-rojo-naranja" />
              ) : (
                <Menu className="w-7 h-7 text-naranja" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden pb-8 space-y-4 animate-in slide-in-from-top duration-300">
              
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link.href)}
                  className={`block w-full text-left px-5 py-3 rounded-xl font-semibold transition-all ${
                    isActive(link.href)
                      ? 'bg-gradient-cta text-blanco shadow-naranja'
                      : 'text-gris-oscuro hover:bg-gris-claro hover:text-naranja'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              {/* MOBILE DROPDOWN SERVICIOS */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="w-full text-left px-5 py-3 rounded-xl font-semibold text-gris-oscuro hover:bg-gris-claro hover:text-naranja transition-all flex items-center justify-between"
                >
                  <span>Servicios</span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${
                      isMobileServicesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isMobileServicesOpen && (
                  <div className="pl-4 space-y-3 bg-blanco rounded-lg py-4 border-l-4 border-naranja">
                    {serviceItems.map((service) => {
                      const IconComponent = service.icon;
                      return (
                        <button
                          key={service.href}
                          onClick={() => handleNavigation(service.href)}
                          className={`block w-full text-left px-4 py-3 rounded-lg transition-all ${
                            isActive(service.href)
                              ? 'bg-naranja text-blanco font-bold'
                              : 'text-gris-oscuro hover:bg-naranja/10 hover:text-naranja'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5" />
                            <div>
                              <p className="font-semibold text-sm">{service.label}</p>
                              <p className="text-xs opacity-75">{service.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-gris-medio my-4"></div>

              <div className="space-y-3 px-2">
                <a
                  href="tel:+50240000000"
                  className="flex items-center gap-3 text-rojo-naranja font-bold hover:text-naranja transition-colors py-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>+502 5556 6379</span>
                </a>

                <a
                  href="https://wa.me/50240000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta w-full px-5 py-3 rounded-lg font-bold text-center flex items-center justify-center gap-2 shadow-naranja"
                >
                  <Phone className="w-5 h-5" />
                  ¡Contáctanos por WhatsApp!
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}