'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (href) => {
    setIsOpen(false);
    
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
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Contacto', href: '/contacto' },
  ];

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-gradient-primary text-blanco py-2 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            
            <div className="flex items-center gap-6">
              <a 
                href="tel:+50240000000" 
                className="flex items-center gap-2 hover:text-amarillo-dorado transition-colors font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>+502 4000 0000</span>
              </a>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Quetzaltenango, Guatemala</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="opacity-90">📍 Lun - Vie: 8:00 AM - 6:00 PM</span>
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
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link.href)}
                  className={`relative px-4 py-2 font-semibold transition-all duration-300 group ${
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
            </div>

            {/* CTA Button Desktop */}
            <div className="hidden lg:block">
              <a
                href="https://wa.me/50240000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 shadow-naranja"
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
            <div className="lg:hidden pb-6 space-y-3 animate-in slide-in-from-top duration-300">
              
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

              <div className="border-t border-gris-medio my-4"></div>

              <div className="space-y-3 px-2">
                <a
                  href="tel:+50240000000"
                  className="flex items-center gap-3 text-rojo-naranja font-bold hover:text-naranja transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>+502 4000 0000</span>
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