import Link from 'next/link'
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer-bg">
      <div className="container mx-auto px-4 py-12">

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* ABOUT */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-blanco">Multi</span>
              <span 
                style={{
                  background: 'linear-gradient(135deg, #FF8C00, #E04A1F, #FFD700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                inmuebles
              </span>
            </h3>
            <p className="text-gris-medio leading-relaxed text-sm mb-6">
              Especialistas en compra y venta de bienes raíces en Quetzaltenango y sus alrededores.
              Encuentra propiedades confiables, asesoría profesional y procesos transparentes.
            </p>

            {/* CTA WHATSAPP */}
            <a
              href="https://wa.me/50240000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-cta px-6 py-3 rounded-lg font-semibold transition-all shadow-naranja"
            >
              <MessageCircle className="w-5 h-5" />
              Contactar por WhatsApp
            </a>
          </div>

          {/* ENLACES */}
          <div>
            <h4 className="text-lg font-bold mb-6 footer-heading">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="footer-link flex items-center gap-2 text-sm group"
                >
                  <span className="text-naranja group-hover:translate-x-1 transition-transform">→</span>
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  href="/propiedades" 
                  className="footer-link flex items-center gap-2 text-sm group"
                >
                  <span className="text-naranja group-hover:translate-x-1 transition-transform">→</span>
                  Propiedades
                </Link>
              </li>
              <li>
                <Link 
                  href="/anuncios" 
                  className="footer-link flex items-center gap-2 text-sm group"
                >
                  <span className="text-naranja group-hover:translate-x-1 transition-transform">→</span>
                  Anuncios
                </Link>
              </li>
              <li>
                <Link 
                  href="/nosotros" 
                  className="footer-link flex items-center gap-2 text-sm group"
                >
                  <span className="text-naranja group-hover:translate-x-1 transition-transform">→</span>
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link 
                  href="/contacto" 
                  className="footer-link flex items-center gap-2 text-sm group"
                >
                  <span className="text-naranja group-hover:translate-x-1 transition-transform">→</span>
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACTO */}
          <div>
            <h4 className="text-lg font-bold mb-6 footer-heading">Información de Contacto</h4>
            <div className="space-y-4">
              
              {/* TELÉFONO */}
              <div className="flex items-start gap-3 group">
                <Phone className="w-5 h-5 text-naranja mt-1 group-hover:rotate-12 transition-transform" />
                <div>
                  <p className="text-gris-medio text-xs font-medium mb-1">Teléfono</p>
                  <a 
                    href="tel:+50240000000" 
                    className="phone-number hover:text-naranja transition-colors"
                  >
                    +502 4000 0000
                  </a>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-start gap-3 group">
                <Mail className="w-5 h-5 text-naranja mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-gris-medio text-xs font-medium mb-1">Correo Electrónico</p>
                  <a 
                    href="mailto:contacto@multinmuebles.com" 
                    className="text-blanco hover:text-naranja transition-colors text-sm"
                  >
                    contacto@multinmuebles.com
                  </a>
                </div>
              </div>

              {/* UBICACIÓN */}
              <div className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-naranja mt-1 group-hover:bounce transition-transform" />
                <div>
                  <p className="text-gris-medio text-xs font-medium mb-1">Ubicación</p>
                  <p className="text-blanco text-sm">
                    Quetzaltenango, Guatemala
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* MAPA */}
          <div>
            <h4 className="text-lg font-bold mb-6 footer-heading">Encuéntranos</h4>
            <div className="rounded-xl overflow-hidden shadow-lg border-2 border-naranja/30 hover:border-naranja transition-all">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.719642438568!2d-91.5189!3d14.8453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85894a5d2abcd123%3A0xee7b2ce060a9c9e7!2sQuetzaltenango!5e0!3m2!1ses!2sgt!4v1234567890"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Ubicación Multinmuebles"
              ></iframe>
            </div>
          </div>

        </div>

        {/* DIVISOR CON DEGRADADO */}
        <div className="border-t border-gris-oscuro/50 pt-8">

          {/* REDES SOCIALES */}
          <div className="flex justify-center gap-6 mb-6">
            
            {/* FACEBOOK */}
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gris-oscuro hover:bg-gradient-cta text-blanco transition-all shadow-md hover:shadow-naranja hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* INSTAGRAM */}
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gris-oscuro hover:bg-gradient-cta text-blanco transition-all shadow-md hover:shadow-naranja hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.265-.057 1.645-.069 4.849-.069zm0-2.163C8.756 0 8.331.012 7.052.07 2.696.272.273 2.69.07 7.052.012 8.331 0 8.756 0 12s.012 3.669.07 4.948c.202 4.358 2.625 6.78 6.987 6.98 1.279.058 1.704.07 4.947.07s3.668-.012 4.947-.07c4.358-.202 6.78-2.625 6.98-6.98.058-1.279.072-1.704.072-4.948s-.012-3.669-.072-4.948c-.202-4.354-2.625-6.78-6.98-6.977C15.668.012 15.259 0 12 0z" />
                <circle cx="12" cy="12" r="3.6" />
              </svg>
            </a>

            {/* LINKEDIN */}
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gris-oscuro hover:bg-gradient-cta text-blanco transition-all shadow-md hover:shadow-naranja hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.006 1.419-.103.249-.129.597-.129.946v5.44h-3.562s.05-8.82 0-9.737h3.562v1.378c.43-.664 1.199-1.608 2.925-1.608 2.134 0 3.734 1.39 3.734 4.38v5.587zM5.337 9.433c-1.144 0-1.915-.762-1.915-1.715 0-.953.77-1.715 1.926-1.715.955 0 1.926.762 1.915 1.715 0 .953-.77 1.715-1.926 1.715zm1.946 11.019H3.394V9.694h3.889v10.758zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>

          </div>

          {/* COPYRIGHT */}
          <div className="text-center space-y-2">
            <p className="text-blanco text-sm font-semibold">
              &copy; {year}{' '}
              <span className="text-blanco">Multi</span>
              <span 
                style={{
                  background: 'linear-gradient(135deg, #FF8C00, #E04A1F, #FFD700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                inmuebles
              </span>
              {' '}— Todos los derechos reservados.
            </p>
            <p className="text-gris-medio text-xs opacity-80">
              Propiedades en venta en Quetzaltenango • Casas • Terrenos • Apartamentos
            </p>
            <div className="flex justify-center gap-4 text-xs text-gris-medio pt-2">
              <Link href="/privacidad" className="hover:text-naranja transition-colors">
                Política de Privacidad
              </Link>
              <span>|</span>
              <Link href="/terminos" className="hover:text-naranja transition-colors">
                Términos y Condiciones
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}