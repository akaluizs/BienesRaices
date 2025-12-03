/**
 * Configuración de Middleware
 */

export const MIDDLEWARE_CONFIG = {
  // ============================================
  // RUTAS PROTEGIDAS
  // ============================================
  adminRoutes: [
    '/admin/propiedades',
    '/admin/anuncios',
    '/admin/contactos',
    '/admin/dashboard',
    '/admin/cache',
    '/admin/optimizar-imagenes',
    '/admin/login',
  ],

  // ============================================
  // RUTAS PÚBLICAS
  // ============================================
  publicRoutes: [
    '/',
    '/propiedades',
    '/propiedades/[id]',
    '/preventa',
    '/anuncios',
    '/nosotros',
    '/contacto',
    '/servicios/constructora',
  ],

  // ============================================
  // RUTAS SIN AUTENTICACIÓN
  // ============================================
  authRoutes: [
    '/admin/login',
    '/admin/registro',
  ],

  // ============================================
  // CACHÉ POR TIPO DE RUTA
  // ============================================
  cacheControl: {
    // Assets estáticos - 1 año
    static: 'public, max-age=31536000, immutable',

    // Páginas públicas - 1 hora + revalidación
    public: 'public, max-age=3600, stale-while-revalidate=86400',

    // Páginas dinámicas - 30 minutos
    dynamic: 'public, max-age=1800, stale-while-revalidate=3600',

    // Admin - sin caché
    admin: 'no-store, no-cache, must-revalidate, proxy-revalidate',

    // API - sin caché
    api: 'no-store, no-cache, must-revalidate, proxy-revalidate',
  },

  // ============================================
  // RATE LIMITING
  // ============================================
  rateLimit: {
    // Máximo de requests por IP por minuto
    requestsPerMinute: 60,
    requestsPerHour: 1000,

    // Endpoints con límites estrictos
    strictLimit: {
      '/api/auth/login': 5, // 5 intentos por minuto
      '/api/contacto': 3, // 3 mensajes por minuto
    },
  },

  // ============================================
  // SECURITY HEADERS
  // ============================================
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },

  // ============================================
  // COOKIES
  // ============================================
  cookies: {
    auth: {
      name: 'sb-auth-token',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 horas
    },
    session: {
      name: 'sb-session',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 días
    },
  },

  // ============================================
  // REDIRECCIONES
  // ============================================
  redirects: {
    // Redirigir rutas antiguas
    '/propiedades-list': '/propiedades',
    '/inmuebles': '/propiedades',
    '/proyectos': '/preventa',
  },
}

/**
 * Helpers
 */
export function isAdminRoute(pathname) {
  return MIDDLEWARE_CONFIG.adminRoutes.some(route =>
    pathname.startsWith(route)
  )
}

export function isPublicRoute(pathname) {
  return MIDDLEWARE_CONFIG.publicRoutes.some(route =>
    pathname.startsWith(route)
  )
}

export function getCacheControl(pathname) {
  // Archivos estáticos
  if (pathname.match(/\.(jpg|png|gif|webp|svg|woff|woff2|ttf|eot)$/i)) {
    return MIDDLEWARE_CONFIG.cacheControl.static
  }

  // Admin
  if (isAdminRoute(pathname)) {
    return MIDDLEWARE_CONFIG.cacheControl.admin
  }

  // API
  if (pathname.startsWith('/api')) {
    return MIDDLEWARE_CONFIG.cacheControl.api
  }

  // Dinámicas
  if (pathname.startsWith('/propiedades/') || pathname.startsWith('/anuncios/')) {
    return MIDDLEWARE_CONFIG.cacheControl.dynamic
  }

  // Públicas
  if (isPublicRoute(pathname)) {
    return MIDDLEWARE_CONFIG.cacheControl.public
  }

  // Default
  return MIDDLEWARE_CONFIG.cacheControl.public
}