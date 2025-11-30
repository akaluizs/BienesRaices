'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (href) => {
    setIsOpen(false);
    
    // Usar startViewTransition si está disponible
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
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Contacto', href: '/contacto' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <span 
              onClick={() => handleNavigation('/')}
              className="text-2xl font-bold text-cerro-verde cursor-pointer hover:text-xela-navy transition-colors"
            >
              Multi inmuebles 
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigation(link.href)}
                className={`transition-colors ${
                  isActive(link.href)
                    ? 'text-cerro-verde font-semibold'
                    : 'text-granito hover:text-cerro-verde'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigation(link.href)}
                className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                  isActive(link.href)
                    ? 'bg-cerro-verde text-white'
                    : 'text-granito hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}