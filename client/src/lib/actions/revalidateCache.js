'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * ✅ Revalidar la página de propiedades completa
 */
export async function revalidateProperties() {
  try {
    console.log('🔄 Revalidando caché de propiedades...');
    
    // Revalidar las rutas del admin
    revalidatePath('/admin/propiedades');
    revalidatePath('/admin/propiedades/nueva');
    revalidatePath('/admin/propiedades/editar');
    
    // Revalidar rutas públicas
    revalidatePath('/propiedades');
    
    // Revalidar tags
    revalidateTag('properties');
    
    console.log('✅ Caché de propiedades revalidado exitosamente');
    
    return { success: true, message: '✅ Caché revalidado' };
  } catch (error) {
    console.error('❌ Error revalidando caché:', error);
    return { success: false, error: error.message };
  }
}

/**
 * ✅ Revalidar una propiedad específica
 */
export async function revalidateProperty(propertyId) {
  try {
    console.log(`🔄 Revalidando propiedad ${propertyId}...`);
    
    // Rutas específicas de la propiedad
    revalidatePath(`/propiedades/${propertyId}`);
    revalidatePath(`/admin/propiedades/editar/${propertyId}`);
    
    // Rutas generales (porque cambió una propiedad)
    revalidatePath('/admin/propiedades');
    revalidatePath('/propiedades');
    
    // Tags específicos
    revalidateTag(`property-${propertyId}`);
    revalidateTag('properties');
    
    console.log(`✅ Propiedad ${propertyId} revalidada`);
    
    return { success: true, message: `✅ Propiedad ${propertyId} actualizada` };
  } catch (error) {
    console.error('❌ Error revalidando propiedad:', error);
    return { success: false, error: error.message };
  }
}

/**
 * ✅ Revalidar después de crear una propiedad
 */
export async function revalidateAfterCreate() {
  try {
    console.log('🔄 Revalidando después de crear propiedad...');
    
    revalidatePath('/admin/propiedades');
    revalidatePath('/propiedades');
    revalidateTag('properties');
    
    console.log('✅ Caché revalidado después de creación');
    
    return { success: true, message: '✅ Propiedad creada y caché actualizado' };
  } catch (error) {
    console.error('❌ Error en revalidación:', error);
    return { success: false, error: error.message };
  }
}

/**
 * ✅ Revalidar después de actualizar una propiedad
 */
export async function revalidateAfterUpdate(propertyId) {
  try {
    console.log(`🔄 Revalidando después de actualizar propiedad ${propertyId}...`);
    
    revalidatePath(`/propiedades/${propertyId}`);
    revalidatePath(`/admin/propiedades/editar/${propertyId}`);
    revalidatePath('/admin/propiedades');
    revalidatePath('/propiedades');
    
    revalidateTag(`property-${propertyId}`);
    revalidateTag('properties');
    
    console.log(`✅ Caché actualizado después de actualizar propiedad ${propertyId}`);
    
    return { success: true, message: '✅ Propiedad actualizada y caché sincronizado' };
  } catch (error) {
    console.error('❌ Error en revalidación:', error);
    return { success: false, error: error.message };
  }
}

/**
 * ✅ Revalidar después de eliminar una propiedad
 */
export async function revalidateAfterDelete(propertyId) {
  try {
    console.log(`🔄 Revalidando después de eliminar propiedad ${propertyId}...`);
    
    // La ruta específica ya no existe, pero revalidamos las listas
    revalidatePath('/admin/propiedades');
    revalidatePath('/propiedades');
    
    revalidateTag(`property-${propertyId}`);
    revalidateTag('properties');
    
    console.log(`✅ Caché actualizado después de eliminar propiedad ${propertyId}`);
    
    return { success: true, message: '✅ Propiedad eliminada y caché sincronizado' };
  } catch (error) {
    console.error('❌ Error en revalidación:', error);
    return { success: false, error: error.message };
  }
}