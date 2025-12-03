import { createClient } from '@/lib/supabase/server';
import PropiedadesListClient from './PropiedadesListClient';
import { revalidateProperties } from '@/lib/actions/revalidateCache';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Home } from 'lucide-react';

// ✅ CONFIGURACIÓN DE CACHÉ MEJORADA
export const revalidate = 3600; // ISR: Revalidar cada 1 hora
export const dynamic = 'force-dynamic'; // Permitir revalidación bajo demanda

// ✅ Metadata para SEO
export const metadata = {
  title: 'Propiedades | Admin',
  description: 'Gestión de propiedades del sistema',
};

/**
 * SERVER COMPONENT - Fetch optimizado con caché ISR
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