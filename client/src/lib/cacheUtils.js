import { cache } from 'react'

/**
 * Cachea una función por el tiempo de request
 * Útil para funciones de base de datos o librerías que no cachean automáticamente
 */
export const memoizeFunction = cache(async (fn) => {
  return fn()
})

/**
 * Cachea un fetch con configuración específica
 */
export async function cachedFetch(url, options = {}) {
  const cacheConfig = {
    cache: 'force-cache',
    next: {
      revalidate: 3600, // 1 hora por defecto
      ...options,
    },
  }

  try {
    const response = await fetch(url, cacheConfig)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    throw error
  }
}

/**
 * Obtiene propiedades con caching
 */
export async function getCachedProperties() {
  return await cachedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/properties`,
    {
      next: {
        revalidate: 3600,
        tags: ['properties'],
      },
    }
  )
}

/**
 * Obtiene una propiedad específica con caching
 */
export async function getCachedProperty(id) {
  return await cachedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`,
    {
      next: {
        revalidate: 3600,
        tags: [`property-${id}`, 'property-detail'],
      },
    }
  )
}

/**
 * Obtiene preventas con caching
 */
export async function getCachedPreventas() {
  return await cachedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/preventas`,
    {
      next: {
        revalidate: 3600,
        tags: ['preventas'],
      },
    }
  )
}

/**
 * Datos públicos con caching de 24 horas
 */
export async function getCachedPublicData(key) {
  return await cachedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/public/${key}`,
    {
      next: {
        revalidate: 86400, // 24 horas
        tags: ['public-data'],
      },
    }
  )
}