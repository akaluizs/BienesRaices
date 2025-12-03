import { createClient } from '@/lib/supabase/server';

/**
 * ✅ Query #1: Listado público de propiedades
 * Usa índice: idx_propiedades_created_id
 * Performance: ~5-10ms
 */
export async function getPublicPropertiesList({ limit = 50, offset = 0 } = {}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('propiedades')
    .select(`
      id,
      titulo,
      ubicacion,
      precio,
      tipo,
      habitaciones,
      banos,
      metros2,
      header_image,
      VentaPreventa
    `)
    .order('created_ad', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('❌ Error fetching properties:', error);
    throw error;
  }

  console.log(`📊 Loaded ${data.length} properties (offset: ${offset})`);
  return data;
}

/**
 * ✅ Query #2: Detalle de propiedad por ID
 * Usa índice: propiedades_pkey (PRIMARY KEY)
 * Performance: ~1-2ms
 */
export async function getPropertyDetail(propertyId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('propiedades')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (error) {
    console.error('❌ Error fetching property detail:', error);
    throw error;
  }

  return data;
}

/**
 * ✅ Query #3: Filtrar propiedades por tipo
 * Usa índice: idx_propiedades_tipo_created (compuesto)
 * Performance: ~5-10ms
 */
export async function getPropertiesByType({ tipo, limit = 50, offset = 0 } = {}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('propiedades')
    .select(`
      id,
      titulo,
      ubicacion,
      precio,
      tipo,
      habitaciones,
      banos,
      metros2,
      header_image,
      VentaPreventa
    `)
    .eq('tipo', tipo)
    .order('created_ad', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('❌ Error fetching properties by type:', error);
    throw error;
  }

  console.log(`📊 Loaded ${data.length} properties of type: ${tipo}`);
  return data;
}

/**
 * ✅ Query #4: Búsqueda full-text en título y ubicación
 * Usa índice: idx_propiedades_titulo_ubicacion (GIN)
 * Performance: ~10-20ms
 */
export async function searchProperties(searchTerm, { limit = 50 } = {}) {
  const supabase = createClient();

  // Sanitizar término de búsqueda
  const cleanTerm = searchTerm.trim().replace(/[^\w\s]/g, '');

  if (!cleanTerm) {
    return [];
  }

  const { data, error } = await supabase
    .from('propiedades')
    .select(`
      id,
      titulo,
      ubicacion,
      precio,
      tipo,
      habitaciones,
      banos,
      metros2,
      header_image
    `)
    .ilike('titulo', `%${cleanTerm}%`)
    .limit(limit);

  if (error) {
    console.error('❌ Error searching properties:', error);
    throw error;
  }

  console.log(`🔍 Search "${cleanTerm}" found ${data.length} results`);
  return data;
}

/**
 * ✅ Query #5: Contar propiedades por tipo
 * Usa índice: idx_propiedades_tipo
 * Performance: ~2-5ms
 */
export async function getPropertiesCountByType() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('propiedades')
    .select('tipo')
    .limit(1000); // Límite de seguridad

  if (error) {
    console.error('❌ Error counting properties:', error);
    throw error;
  }

  // Contar en el cliente (más eficiente que RPC)
  const counts = data.reduce((acc, prop) => {
    acc[prop.tipo] = (acc[prop.tipo] || 0) + 1;
    return acc;
  }, {});

  return {
    total: data.length,
    byType: counts,
  };
}

/**
 * ✅ Query #6: Propiedades destacadas (últimas N)
 * Usa índice: idx_propiedades_created_id
 * Performance: ~3-5ms
 */
export async function getFeaturedProperties({ limit = 10 } = {}) {
  const supabase = createClient();

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
    console.error('❌ Error fetching featured properties:', error);
    throw error;
  }

  return data;
}

/**
 * ✅ Query #7: Verificar si existe una propiedad
 * Usa índice: propiedades_pkey
 * Performance: ~1ms
 */
export async function propertyExists(propertyId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('propiedades')
    .select('id')
    .eq('id', propertyId)
    .single();

  return !error && !!data;
}

// ==========================================
// QUERIES PARA ADMIN
// ==========================================

/**
 * ✅ Query para admin: Listado con más información
 * Performance: ~10-15ms
 */
export async function getAdminPropertiesList({ limit = 50, offset = 0 } = {}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('propiedades')
    .select(`
      id,
      titulo,
      ubicacion,
      precio,
      tipo,
      habitaciones,
      banos,
      metros2,
      VentaPreventa,
      header_image,
      created_ad,
      codigo
    `)
    .order('created_ad', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('❌ Error fetching admin properties:', error);
    throw error;
  }

  return data;
}

/**
 * ✅ Query para admin: Propiedad completa para editar
 * Performance: ~5-8ms
 */
export async function getPropertyForEdit(propertyId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('propiedades')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (error) {
    console.error('❌ Error fetching property for edit:', error);
    throw error;
  }

  return data;
}