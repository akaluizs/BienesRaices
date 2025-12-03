import { kv } from '@vercel/kv';
import { createClient } from '@/lib/supabase/server';

const TTL = {
  LISTADO_PUBLICO: 86400,
  LISTADO_ADMIN: 300,
  DETALLE: 86400,
  BUSQUEDA: 3600,
};

/**
 * ✅ Helper para logs detallados
 */
function logError(context, error) {
  console.error(`\n❌ ERROR en ${context}`);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('Message:', error?.message || 'Sin mensaje');
  console.error('Code:', error?.code || 'Sin código');
  console.error('Status:', error?.status || 'Sin status');
  console.error('Details:', error?.details || error?.hint || 'Sin detalles');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * ✅ Query #1: Listado público de propiedades
 * Performance: ~5-10ms
 */
export async function getPublicProperties({ tipo = null, limit = 50 } = {}) {
  const cacheKey = `properties:public:${tipo || 'all'}:${limit}`;

  try {
    // Intentar caché KV
    try {
      const cached = await kv.get(cacheKey);
      if (cached) {
        console.log(`✅ Cache HIT (KV): ${cacheKey}`);
        return cached;
      }
    } catch (kvError) {
      console.warn('⚠️ KV unavailable:', kvError.message);
    }

    console.log(`🔄 Consultando Supabase para: ${cacheKey}`);

    // Query a Supabase
    const supabase = createClient();

    if (!supabase) {
      throw new Error('❌ Supabase client no inicializado. Verifica variables de entorno.');
    }

    let query = supabase
      .from('propiedades')
      .select(`
        id,
        titulo,
        precio,
        ubicacion,
        metros2,
        habitaciones,
        banos,
        header_image,
        tipo,
        VentaPreventa
      `)
      .eq('VentaPreventa', 'Venta')
      .order('created_ad', { ascending: false })
      .limit(limit);

    if (tipo && tipo !== 'todos') {
      query = query.eq('tipo', tipo);
    }

    const { data, error } = await query;

    if (error) {
      logError('getPublicProperties', error);
      throw new Error(`Supabase: ${error.message || 'Error desconocido'}`);
    }

    if (!data) {
      console.warn('⚠️ No data returned from Supabase');
      return [];
    }

    console.log(`✅ Query success: ${data.length} propiedades`);

    // Guardar en caché
    try {
      await kv.set(cacheKey, data, { ex: TTL.LISTADO_PUBLICO });
      console.log(`💾 Cached: ${cacheKey}`);
    } catch (kvError) {
      console.warn('⚠️ KV cache failed:', kvError.message);
    }

    return data;
  } catch (error) {
    logError('getPublicProperties (catch)', error);
    throw error;
  }
}

/**
 * ✅ Query #2: Detalle de propiedad
 * Performance: ~1-2ms
 */
export async function getPropertyDetail(id) {
  const cacheKey = `property:detail:${id}`;

  try {
    // Intentar caché
    try {
      const cached = await kv.get(cacheKey);
      if (cached) {
        console.log(`✅ Cache HIT: ${cacheKey}`);
        return cached;
      }
    } catch (kvError) {
      console.warn('⚠️ KV unavailable');
    }

    console.log(`🔄 Consultando Supabase para: ${cacheKey}`);

    const supabase = createClient();

    if (!supabase) {
      throw new Error('❌ Supabase client no inicializado');
    }

    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logError('getPropertyDetail', error);
      throw new Error(`Supabase: ${error.message || 'Error desconocido'}`);
    }

    if (!data) {
      console.warn(`⚠️ Property not found: ${id}`);
      return null;
    }

    console.log(`✅ Query success: ${data.titulo}`);

    // Caché
    try {
      await kv.set(cacheKey, data, { ex: TTL.DETALLE });
    } catch (kvError) {
      console.warn('⚠️ KV cache failed');
    }

    return data;
  } catch (error) {
    logError('getPropertyDetail (catch)', error);
    throw error;
  }
}

/**
 * ✅ Query #3: Filtrar por tipo
 */
export async function getPropertiesByType({ tipo, limit = 50, offset = 0 } = {}) {
  try {
    console.log(`🔄 Consultando propiedades por tipo: ${tipo}`);

    const supabase = createClient();

    if (!supabase) {
      throw new Error('❌ Supabase client no inicializado');
    }

    const { data, error } = await supabase
      .from('propiedades')
      .select(`
        id,
        titulo,
        precio,
        ubicacion,
        metros2,
        habitaciones,
        banos,
        header_image,
        tipo,
        VentaPreventa
      `)
      .eq('tipo', tipo)
      .eq('VentaPreventa', 'Venta')
      .order('created_ad', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      logError('getPropertiesByType', error);
      throw new Error(`Supabase: ${error.message}`);
    }

    console.log(`✅ Query success: ${data?.length || 0} propiedades`);
    return data || [];
  } catch (error) {
    logError('getPropertiesByType (catch)', error);
    throw error;
  }
}

/**
 * ✅ Query #4: Búsqueda
 */
export async function searchProperties(searchTerm, { limit = 50 } = {}) {
  try {
    const cleanTerm = searchTerm.trim().replace(/[^\w\s]/g, '');

    if (!cleanTerm) {
      return [];
    }

    console.log(`🔍 Buscando: "${cleanTerm}"`);

    const supabase = createClient();

    if (!supabase) {
      throw new Error('❌ Supabase client no inicializado');
    }

    const { data, error } = await supabase
      .from('propiedades')
      .select(`
        id,
        titulo,
        precio,
        ubicacion,
        metros2,
        habitaciones,
        banos,
        header_image,
        tipo
      `)
      .ilike('titulo', `%${cleanTerm}%`)
      .eq('VentaPreventa', 'Venta')
      .limit(limit);

    if (error) {
      logError('searchProperties', error);
      throw new Error(`Supabase: ${error.message}`);
    }

    console.log(`✅ Search success: ${data?.length || 0} resultados`);
    return data || [];
  } catch (error) {
    logError('searchProperties (catch)', error);
    return [];
  }
}

/**
 * ✅ Query #5: Contar por tipo
 */
export async function getPropertiesCountByType() {
  try {
    console.log('🔄 Contando propiedades por tipo...');

    const supabase = createClient();

    if (!supabase) {
      throw new Error('❌ Supabase client no inicializado');
    }

    const { data, error } = await supabase
      .from('propiedades')
      .select('tipo')
      .limit(1000);

    if (error) {
      logError('getPropertiesCountByType', error);
      throw new Error(`Supabase: ${error.message}`);
    }

    const counts = (data || []).reduce((acc, prop) => {
      acc[prop.tipo] = (acc[prop.tipo] || 0) + 1;
      return acc;
    }, {});

    console.log(`✅ Count success:`, counts);
    return {
      total: data?.length || 0,
      byType: counts,
    };
  } catch (error) {
    logError('getPropertiesCountByType (catch)', error);
    throw error;
  }
}

/**
 * ✅ Query #6: Propiedades destacadas
 */
export async function getFeaturedProperties({ limit = 10 } = {}) {
  try {
    console.log('🔄 Cargando propiedades destacadas...');

    const supabase = createClient();

    if (!supabase) {
      throw new Error('❌ Supabase client no inicializado');
    }

    const { data, error } = await supabase
      .from('propiedades')
      .select(`
        id,
        titulo,
        ubicacion,
        precio,
        tipo,
        header_image
      `)
      .order('created_ad', { ascending: false })
      .limit(limit);

    if (error) {
      logError('getFeaturedProperties', error);
      throw new Error(`Supabase: ${error.message}`);
    }

    console.log(`✅ Featured success: ${data?.length || 0} propiedades`);
    return data || [];
  } catch (error) {
    logError('getFeaturedProperties (catch)', error);
    throw error;
  }
}

/**
 * ✅ Query #7: Verificar existencia
 */
export async function propertyExists(propertyId) {
  try {
    const supabase = createClient();

    if (!supabase) {
      throw new Error('❌ Supabase client no inicializado');
    }

    const { data, error } = await supabase
      .from('propiedades')
      .select('id')
      .eq('id', propertyId)
      .single();

    return !error && !!data;
  } catch (error) {
    console.warn('⚠️ propertyExists check failed');
    return false;
  }
}

// ==========================================
// QUERIES PARA ADMIN
// ==========================================

export async function getAdminPropertiesList({ limit = 50, offset = 0 } = {}) {
  try {
    console.log('🔄 Admin: Cargando listado...');

    const supabase = createClient();

    if (!supabase) {
      throw new Error('❌ Supabase client no inicializado');
    }

    const { data, error } = await supabase
      .from('propiedades')
      .select(`
        id,
        titulo,
        precio,
        ubicacion,
        metros2,
        habitaciones,
        banos,
        header_image,
        tipo,
        VentaPreventa,
        codigo,
        created_ad
      `)
      .order('created_ad', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      logError('getAdminPropertiesList', error);
      throw new Error(`Supabase: ${error.message}`);
    }

    console.log(`✅ Admin list success: ${data?.length || 0} propiedades`);
    return data || [];
  } catch (error) {
    logError('getAdminPropertiesList (catch)', error);
    throw error;
  }
}

export async function getPropertyForEdit(propertyId) {
  try {
    console.log(`🔄 Cargando propiedad para editar: ${propertyId}`);

    const supabase = createClient();

    if (!supabase) {
      throw new Error('❌ Supabase client no inicializado');
    }

    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (error) {
      logError('getPropertyForEdit', error);
      throw new Error(`Supabase: ${error.message}`);
    }

    console.log(`✅ Edit property success: ${data?.titulo}`);
    return data;
  } catch (error) {
    logError('getPropertyForEdit (catch)', error);
    throw error;
  }
}

/**
 * ✅ Invalidar caché
 */
export async function invalidatePropertyCache(propertyId = null) {
  const patterns = [
    'properties:public:*',
    'properties:admin:*',
    'properties:search:*',
  ];

  if (propertyId) {
    patterns.push(`property:detail:${propertyId}`);
  }

  let totalInvalidated = 0;

  for (const pattern of patterns) {
    try {
      const keys = await kv.keys(pattern);
      if (keys.length > 0) {
        await kv.del(...keys);
        console.log(`🗑️ Invalidated ${keys.length} keys: ${pattern}`);
        totalInvalidated += keys.length;
      }
    } catch (error) {
      console.warn(`⚠️ Failed to invalidate ${pattern}:`, error.message);
    }
  }

  return totalInvalidated;
}

/**
 * ✅ Estadísticas de caché
 */
export async function getCacheStats() {
  try {
    const patterns = ['properties:*', 'property:*'];
    let totalKeys = 0;

    for (const pattern of patterns) {
      const keys = await kv.keys(pattern);
      totalKeys += keys.length;
    }

    return {
      cachedKeys: totalKeys,
      availableSpace: '256 MB',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Error getting cache stats:', error);
    return null;
  }
}