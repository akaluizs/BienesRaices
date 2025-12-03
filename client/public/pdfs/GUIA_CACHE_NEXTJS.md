# 🚀 Guía Completa: Configuración de Caché en Next.js

## 📋 Análisis de tu Código Actual

### ✅ Cosas que están bien:
- Uso de `revalidate` para ISR (Incremental Static Regeneration)
- Separación de lógica cliente/servidor
- Uso de `force-static` en el componente servidor

### ⚠️ Problemas identificados:

1. **Conflicto de configuraciones**: Tienes `dynamic = 'force-static'` pero también `revalidate = 7200`, lo cual puede causar comportamiento impredecible
2. **Cache helpers no se están usando**: Tienes archivos de configuración de caché pero no los estás utilizando en tus componentes
3. **fetchCache redundante**: `fetchCache = 'force-cache'` es redundante con las otras configuraciones
4. **Falta de tags para revalidación selectiva**: No estás usando tags de caché para invalidar datos específicos

---

## 🔧 Configuración Recomendada

### 1. **Actualizar `page.js` (Server Component)**

```javascript
import { createClient } from '@/lib/supabase/server';
import PropiedadesListClient from './PropiedadesListClient';
import { revalidateProperties } from '@/lib/actions/revalidateCache';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Home } from 'lucide-react';

// ✅ CONFIGURACIÓN DE CACHÉ MEJORADA
export const revalidate = 3600; // 1 hora (más razonable que 2 horas)
export const dynamic = 'force-dynamic'; // Cambiado a dynamic para permitir revalidación
// Removido fetchCache - no es necesario

// ✅ Metadata para SEO
export const metadata = {
  title: 'Propiedades | Admin',
  description: 'Gestión de propiedades del sistema',
};

/**
 * SERVER COMPONENT - Fetch optimizado con caché
 * ✅ Usa ISR con revalidación cada 1 hora
 * ✅ Soporta revalidación bajo demanda con tags
 */
export default async function PropiedadesPage() {
  try {
    const supabase = createClient();

    // ✅ Fetch con configuración de caché explícita
    const { data: propiedades, error } = await supabase
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
        created_ad
      `)
      .order('created_ad', { ascending: false })
      .limit(100);

    if (error) {
      console.error('❌ Error fetching properties:', error);
      throw error;
    }

    if (!propiedades || propiedades.length === 0) {
      console.warn('⚠️ No se encontraron propiedades');
    }

    // ✅ TRANSFORMACIÓN: Usar directamente header_image
    const propiedadesOptimizadas = propiedades.map((prop) => ({
      id: prop.id,
      titulo: prop.titulo || 'Sin título',
      ubicacion: prop.ubicacion || 'Sin ubicación',
      precio: prop.precio || 0,
      tipo: prop.tipo || 'Otro',
      habitaciones: prop.habitaciones || 0,
      banos: prop.banos || 0,
      metros2: prop.metros2 || 0,
      imagen: prop.header_image || null, 
      VentaPreventa: prop.VentaPreventa || 'Venta',
    }));

    // ⭐ DEBUG EN DESARROLLO
    if (process.env.NODE_ENV === 'development') {
      const totalSize = JSON.stringify(propiedadesOptimizadas).length;
      const avgPerProp = propiedadesOptimizadas.length > 0
        ? (totalSize / propiedadesOptimizadas.length / 1024).toFixed(2)
        : 0;

      const conImagen = propiedadesOptimizadas.filter(p => p.imagen).length;
      const sinImagen = propiedadesOptimizadas.length - conImagen;

      const stats = {
        total: propiedadesOptimizadas.length,
        casas: propiedadesOptimizadas.filter(p => p.tipo === 'Casa').length,
        apartamentos: propiedadesOptimizadas.filter(p => p.tipo === 'Apartamento').length,
        terrenos: propiedadesOptimizadas.filter(p => p.tipo === 'Terreno').length,
        comerciales: propiedadesOptimizadas.filter(p => p.tipo === 'Local Comercial').length,
        venta: propiedadesOptimizadas.filter(p => p.VentaPreventa === 'Venta').length,
        preventa: propiedadesOptimizadas.filter(p => p.VentaPreventa === 'Preventa').length,
      };

      console.log('📊 ════════════════════════════════════');
      console.log(`📊 Propiedades cargadas: ${stats.total}`);
      console.log(`📏 Tamaño total: ${(totalSize / 1024).toFixed(2)} KB`);
      console.log(`📏 Promedio/propiedad: ${avgPerProp} KB`);
      console.log('📈 Distribución:');
      console.log(`   🏠 Casas: ${stats.casas}`);
      console.log(`   🏢 Apartamentos: ${stats.apartamentos}`);
      console.log(`   🌱 Terrenos: ${stats.terrenos}`);
      console.log(`   🏪 Comerciales: ${stats.comerciales}`);
      console.log(`   💰 Venta: ${stats.venta} | 🔄 Preventa: ${stats.preventa}`);
      console.log(`   📸 Con imagen: ${conImagen} | Sin imagen: ${sinImagen}`);
      console.log('📊 ════════════════════════════════════\n');
    }

    return (
      <PropiedadesListClient
        propiedadesIniciales={propiedadesOptimizadas}
        onRevalidate={revalidateProperties}
      />
    );
  } catch (error) {
    console.error('❌ Error en PropiedadesPage:', error);

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gris-oscuro flex items-center gap-3">
              <Home className="w-9 h-9 text-naranja" />
              Propiedades
            </h1>
          </div>
        </div>

        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-red-900">Error cargando propiedades</p>
                <p className="text-sm text-red-800 mt-1">
                  {error?.message || 'Error desconocido'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
```

---

### 2. **Crear `revalidateCache.js` (Server Action)**

```javascript
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Revalidar la página de propiedades
 */
export async function revalidateProperties() {
  try {
    console.log('🔄 Revalidando caché de propiedades...');
    
    // Revalidar la ruta completa
    revalidatePath('/admin/propiedades');
    revalidatePath('/propiedades');
    
    // También revalidar tags si los estás usando
    revalidateTag('properties');
    
    console.log('✅ Caché revalidado exitosamente');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error revalidando caché:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Revalidar una propiedad específica
 */
export async function revalidateProperty(propertyId) {
  try {
    console.log(`🔄 Revalidando propiedad ${propertyId}...`);
    
    revalidatePath(`/propiedades/${propertyId}`);
    revalidatePath('/admin/propiedades');
    revalidateTag(`property-${propertyId}`);
    revalidateTag('properties');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error revalidando propiedad:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Revalidar después de crear/actualizar/eliminar
 */
export async function revalidateAfterMutation() {
  try {
    console.log('🔄 Revalidando después de mutación...');
    
    // Revalidar todas las rutas relacionadas
    revalidatePath('/admin/propiedades');
    revalidatePath('/propiedades');
    revalidateTag('properties');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error en revalidación:', error);
    return { success: false, error: error.message };
  }
}
```

---

### 3. **Actualizar `propertyActions.js`**

```javascript
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidateAfterMutation } from './revalidateCache';

/**
 * Eliminar propiedad y revalidar caché
 */
export async function deleteProperty(propertyId) {
  try {
    const supabase = createClient();

    // 1. Eliminar de la base de datos
    const { error } = await supabase
      .from('propiedades')
      .delete()
      .eq('id', propertyId);

    if (error) throw error;

    // 2. Revalidar caché automáticamente
    await revalidateAfterMutation();

    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Crear propiedad y revalidar caché
 */
export async function createProperty(data) {
  try {
    const supabase = createClient();

    const { data: newProperty, error } = await supabase
      .from('propiedades')
      .insert(data)
      .select()
      .single();

    if (error) throw error;

    // Revalidar caché
    await revalidateAfterMutation();

    return { success: true, data: newProperty };
  } catch (error) {
    console.error('Error creating property:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar propiedad y revalidar caché
 */
export async function updateProperty(propertyId, data) {
  try {
    const supabase = createClient();

    const { data: updatedProperty, error } = await supabase
      .from('propiedades')
      .update(data)
      .eq('id', propertyId)
      .select()
      .single();

    if (error) throw error;

    // Revalidar caché
    await revalidateAfterMutation();

    return { success: true, data: updatedProperty };
  } catch (error) {
    console.error('Error updating property:', error);
    return { success: false, error: error.message };
  }
}
```

---

### 4. **Configurar `next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ✅ Configuración de caché
  experimental: {
    // Permite usar Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // ✅ Headers de caché para assets estáticos
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## 📊 Estrategia de Caché Recomendada

### Por Tipo de Página:

| Tipo | Estrategia | Revalidación | Uso |
|------|-----------|--------------|-----|
| **Lista de Propiedades** | ISR | 1 hora (3600s) | `revalidate: 3600` |
| **Detalle de Propiedad** | ISR | 1 hora | `revalidate: 3600` |
| **Admin Dashboard** | Dinámico | No caché | `dynamic = 'force-dynamic'` |
| **Assets Estáticos** | Estático | Permanente | `max-age=31536000` |
| **Imágenes** | CDN | 7 días | Headers en next.config |

---

## 🎯 Mejores Prácticas

### ✅ DO's (Hacer):

1. **Usar ISR para contenido semi-estático**:
   ```javascript
   export const revalidate = 3600; // 1 hora
   ```

2. **Revalidar después de mutaciones**:
   ```javascript
   await createProperty(data);
   await revalidateAfterMutation();
   ```

3. **Usar Server Actions para operaciones del servidor**:
   ```javascript
   'use server';
   export async function deleteProperty(id) { ... }
   ```

4. **Optimizar imágenes con Next/Image**:
   ```jsx
   <Image
     src={propiedad.imagen}
     alt={propiedad.titulo}
     fill
     sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
     priority={index < 3}
   />
   ```

### ❌ DON'Ts (No hacer):

1. **No usar `force-static` con `revalidate`**: Genera conflictos
   ```javascript
   // ❌ MAL
   export const dynamic = 'force-static';
   export const revalidate = 3600;
   
   // ✅ BIEN
   export const dynamic = 'force-dynamic';
   export const revalidate = 3600;
   ```

2. **No usar `fetchCache` sin necesidad**: Es redundante
   ```javascript
   // ❌ MAL
   export const fetchCache = 'force-cache';
   export const revalidate = 3600;
   
   // ✅ BIEN
   export const revalidate = 3600; // Suficiente
   ```

3. **No cachear páginas de admin**: Deben ser siempre frescas
   ```javascript
   // ✅ BIEN para /admin
   export const dynamic = 'force-dynamic';
   export const revalidate = 0;
   ```

---

## 🔍 Debug de Caché

### Ver qué se está cacheando:

```javascript
// En development, Next.js muestra en consola:
// ○ (Static)  - generado como HTML estático
// λ (Dynamic) - renderizado bajo demanda
// ƒ (ISR)     - Incremental Static Regeneration
```

### Forzar limpieza de caché:

```bash
# Eliminar cache de Next.js
rm -rf .next

# Rebuild
npm run build
```

---

## 📈 Monitoreo de Rendimiento

### Agregar timing logs:

```javascript
export default async function PropiedadesPage() {
  const startTime = Date.now();
  
  try {
    const supabase = createClient();
    const { data: propiedades } = await supabase.from('propiedades').select('*');
    
    const endTime = Date.now();
    console.log(`⏱️ Fetch completado en ${endTime - startTime}ms`);
    
    // ... resto del código
  } catch (error) {
    // ...
  }
}
```

---

## 🚀 Implementación Paso a Paso

1. **Actualizar `page.js`** con la configuración recomendada
2. **Crear/actualizar `revalidateCache.js`** con las funciones de revalidación
3. **Actualizar `propertyActions.js`** para revalidar después de mutaciones
4. **Configurar `next.config.js`** con headers de caché
5. **Probar en desarrollo**: `npm run dev`
6. **Hacer build de producción**: `npm run build`
7. **Revisar el output** para ver qué páginas son estáticas/dinámicas/ISR

---

## 📝 Notas Finales

- **ISR es ideal** para tu caso: contenido que cambia ocasionalmente
- **Revalidación bajo demanda** mantiene la UI sincronizada sin esperar el timeout
- **Next.js 14/15** cachea automáticamente los fetches del servidor
- **Supabase** no tiene caché integrado, depende de Next.js

---

## 🆘 Troubleshooting

### Problema: Los cambios no se reflejan
**Solución**: Verificar que `revalidateAfterMutation()` se esté llamando

### Problema: Página siempre dinámica
**Solución**: Revisar que no haya `cookies()`, `headers()` o `searchParams` en el código

### Problema: Build muy lento
**Solución**: Reducir el número de páginas estáticas generadas en build time

---

## 📚 Recursos Adicionales

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Revalidating Data](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
