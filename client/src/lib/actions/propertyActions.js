'use server';

import { createClient } from '@/lib/supabase/server';
import { 
  revalidateAfterCreate,
  revalidateAfterUpdate,
  revalidateAfterDelete 
} from './revalidateCache';

/**
 * Crear una nueva propiedad
 */
export async function createProperty(propertyData) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('propiedades')
      .insert([propertyData])
      .select()
      .single();

    if (error) throw error;

    //  Revalidar caché después de crear
    await revalidateAfterCreate();

    console.log(`✅ Propiedad creada: ${data.id}`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error creando propiedad:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar una propiedad existente
 */
export async function updateProperty(propertyId, propertyData) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('propiedades')
      .update(propertyData)
      .eq('id', propertyId)
      .select()
      .single();

    if (error) throw error;

    // Revalidar caché después de actualizar
    await revalidateAfterUpdate(propertyId);

    console.log(`✅ Propiedad actualizada: ${propertyId}`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error actualizando propiedad:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Eliminar una propiedad
 */
export async function deleteProperty(propertyId) {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('propiedades')
      .delete()
      .eq('id', propertyId);

    if (error) throw error;

    await revalidateAfterDelete(propertyId);

    console.log(`✅ Propiedad eliminada: ${propertyId}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error eliminando propiedad:', error);
    return { success: false, error: error.message };
  }
}

/**
 *  Obtener una propiedad por ID
 */
export async function getProperty(propertyId) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('❌ Error obteniendo propiedad:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener todas las propiedades
 */
export async function getAllProperties() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .order('created_ad', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('❌ Error obteniendo propiedades:', error);
    return { success: false, error: error.message };
  }
}