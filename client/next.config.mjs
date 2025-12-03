/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-47e1d1275f70467a9a822332f5c8e416.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      // PATRÓN PARA CLOUDFLARE R2
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      // O si usas dominio personalizado con R2
      {
        protocol: 'https',
        hostname: '**.cdn.ejemplo.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-47e1d1275f70467a9a822332f5c8e416.r2.dev',
        pathname: '/propiedades/**',
      },
    ],
    // Habilitar optimización de imágenes
    formats: ['image/avif', 'image/webp'],
    // Configuración de caché
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 año
  },
  reactCompiler: true,

  // CONFIGURACIÓN DE CACHING
  onDemandEntries: {
    // Mantener páginas en memoria durante desarrollo
    maxInactiveAge: 60 * 1000, // 60 segundos
    pagesBufferLength: 5, // Mantener 5 páginas en buffer
  },

  // Experimental features para caching mejorado
  experimental: {
    staleTimes: {
      dynamic: 0, // Páginas dinámicas - sin caché
      static: 60, // Páginas estáticas - 60 segundos
    },
  },
};

export default nextConfig;