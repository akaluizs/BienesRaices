import { Toaster } from "@/components/ui/sonner"
import './globals.css'
import ClientLayout from './ClientLayout'

export const metadata = {
  metadataBase: new URL('https://www.multiinmuebles.com'), // Cambia por tu dominio real
  title: {
    default: "Multi Inmuebles | Bienes Raíces en Quetzaltenango",
    template: "%s | Multi Inmuebles" // Para páginas individuales
  },
  description:
    "Multi Inmuebles es una empresa de bienes raíces ubicada en Quetzaltenango, Guatemala. Especialistas en promoción y venta de casas, terrenos, lotes y propiedades en las mejores zonas.",
  keywords: [
    "bienes raíces en Quetzaltenango",
    "venta de casas en Xela",
    "terrenos en Quetzaltenango",
    "lotes en Xela",
    "propiedades en Guatemala",
    "inmobiliaria en Quetzaltenango",
    "Multi Inmuebles",
    "casas en venta Xela",
    "bienes raíces Guatemala",
    "propiedades Quetzaltenango",
  ],
  authors: [{ name: "Multi Inmuebles", url: "https://www.multiinmuebles.com" }],
  creator: "Multi Inmuebles",
  publisher: "Multi Inmuebles",
  
  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    title: "Multi Inmuebles | Bienes Raíces en Quetzaltenango",
    description:
      "Venta de casas, terrenos, lotes y propiedades en Quetzaltenango. Multi Inmuebles te ayuda a encontrar tu nuevo hogar.",
    url: "https://www.multiinmuebles.com",
    siteName: "Multi Inmuebles",
    locale: "es_GT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Crea una imagen 1200x630px
        width: 1200,
        height: 630,
        alt: "Multi Inmuebles - Bienes Raíces en Quetzaltenango"
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Multi Inmuebles | Bienes Raíces en Quetzaltenango",
    description: "Venta de casas, terrenos y propiedades en Xela, Guatemala",
    images: ["/og-image.jpg"],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verificación (opcional cuando tengas)
  verification: {
    google: 'tu-codigo-google-search-console',
    // yandex: 'tu-codigo-yandex',
    // bing: 'tu-codigo-bing',
  },

  // Configuración de alternativas de idioma (si planeas multiidioma)
  alternates: {
    canonical: 'https://www.multiinmuebles.com',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es-GT">
      <head>
        {/* Meta extra para SEO local */}
        <meta name="robots" content="index, follow" />
        <meta name="geo.region" content="GT-QZ" />
        <meta name="geo.placename" content="Quetzaltenango" />
        <meta name="geo.position" content="14.8453;-91.5180" />
        <meta name="ICBM" content="14.8453, -91.5180" />
        
        {/* Schema.org para negocio local */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Multi Inmuebles",
              "image": "https://www.multiinmuebles.com/logo.png",
              "description": "Inmobiliaria especializada en venta de casas, terrenos y propiedades en Quetzaltenango, Guatemala",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Tu dirección aquí",
                "addressLocality": "Quetzaltenango",
                "addressRegion": "Quetzaltenango",
                "postalCode": "09001",
                "addressCountry": "GT"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "14.8453",
                "longitude": "-91.5180"
              },
              "url": "https://www.multiinmuebles.com",
              "telephone": "+502-4000-0000",
              "priceRange": "$$",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "08:00",
                  "closes": "18:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Saturday",
                  "opens": "09:00",
                  "closes": "13:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/tuPagina",
                "https://www.instagram.com/tuPagina"
              ]
            })
          }}
        />
      </head>

      <body className="bg-white">
        <ClientLayout>{children}</ClientLayout>

        <Toaster 
          position="top-right"
          duration={3000}
          closeButton
          richColors
        />
      </body>
    </html>
  )
}
