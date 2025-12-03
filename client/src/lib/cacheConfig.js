/**
 * Configuración de caching para diferentes tipos de datos
 */

export const CACHE_CONFIG = {
  // Propiedades - Revalidar cada 1 hora
  PROPERTIES: {
    revalidate: 3600, // 1 hora
    tags: ['properties'],
  },

  // Propiedades por ID - Revalidar cada 1 hora
  PROPERTY_DETAIL: {
    revalidate: 3600,
    tags: ['property-detail'],
  },

  // Preventas - Revalidar cada 1 hora
  PREVENTAS: {
    revalidate: 3600,
    tags: ['preventas'],
  },

  // Datos de usuario - Revalidar cada 30 minutos
  USER: {
    revalidate: 1800,
    tags: ['user'],
  },

  // Contactos/Mensajes - Revalidar inmediatamente
  CONTACTS: {
    revalidate: 0,
    tags: ['contacts'],
  },

  // Datos públicos - Revalidar cada 24 horas
  PUBLIC_DATA: {
    revalidate: 86400,
    tags: ['public-data'],
  },

  // Imágenes - Revalidar cada 7 días
  IMAGES: {
    revalidate: 604800,
    tags: ['images'],
  },
};

/**
 * Configuración de fetch con caching
 */
export const createFetchConfig = (cacheKey = 'PUBLIC_DATA') => {
  const config = CACHE_CONFIG[cacheKey] || CACHE_CONFIG.PUBLIC_DATA;

  return {
    cache: 'force-cache',
    next: {
      revalidate: config.revalidate,
      tags: config.tags,
    },
  };
};

/**
 * Opciones de fetch sin caching
 */
export const NO_CACHE_CONFIG = {
  cache: 'no-store',
  next: {
    revalidate: 0,
  },
};

/**
 * Configuración para datos dinámicos
 */
export const DYNAMIC_CONFIG = {
  cache: 'force-cache',
  next: {
    revalidate: 60, // Revalidar cada 1 minuto para datos dinámicos
  },
};