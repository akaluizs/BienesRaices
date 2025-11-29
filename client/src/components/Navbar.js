'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
  <nav className="nav-footer-theme">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4 md:py-6">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-3xl font-bold text-niebla hover:text-arena transition">
            BienesRaíces
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            <Link 
              href="/" 
              className="text-niebla hover:text-arena transition font-medium"
            >
              Inicio
            </Link>
            <Link 
              href="/propiedades" 
              className="text-niebla hover:text-arena transition font-medium"
            >
              Propiedades
            </Link>
             <Link 
              href="/nosotros" 
              className="text-niebla hover:text-arena transition font-medium"
            >
              Nosotros
            </Link>
            <Link 
              href="/contacto" 
              className="text-niebla hover:text-arena transition font-medium"
            >
              Contacto
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-cerro-verde rounded-lg transition"
          >
            <svg 
              className="w-6 h-6 text-niebla" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-arena">
            <Link 
              href="/" 
              className="block px-4 py-2 text-niebla hover:text-arena hover:bg-cerro-verde rounded transition"
            >
              Inicio
            </Link>
            <Link 
              href="/propiedades" 
              className="block px-4 py-2 text-niebla hover:text-arena hover:bg-cerro-verde rounded transition"
            >
              Propiedades
            </Link>
            <Link 
              href="/contacto" 
              className="block px-4 py-2 text-niebla hover:text-arena hover:bg-cerro-verde rounded transition"
            >
              Contacto
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}