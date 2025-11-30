'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PropertyCard from '@/components/PropertyCard';
import { Loader2, Home, Search } from 'lucide-react';

export default function PropiedadesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('all');
  const router = useRouter();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      // Transformar los datos al formato que espera PropertyCard
      const formattedProperties = data.map(prop => ({
        id: prop.id,
        title: prop.titulo,
        price: prop.precio,
        location: prop.ubicacion,
        description: prop.descripcion,
        image: prop.imagenes && prop.imagenes.length > 0 ? prop.imagenes[0] : null,
        area: prop.metros2,
        bedrooms: prop.habitaciones,
        bathrooms: prop.banos,
        parking: null, // Si no tienes este campo
        type: prop.tipo,
      }));

      setProperties(formattedProperties);
    } catch (error) {
      console.error('Error cargando propiedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prop.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prop.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'all' || prop.type === filterTipo;
    return matchesSearch && matchesTipo;
  });

  const handlePropertyClick = (id) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(`/propiedades/${id}`);
      });
    } else {
      router.push(`/propiedades/${id}`);
    }
  };

  if (loading) {
    return (
      <main className="body-theme min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-cerro-verde" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="body-theme min-h-screen py-16" style={{ viewTransitionName: 'main-content' }}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-xela-navy mb-4 text-center">
          Nuestras Propiedades
        </h1>
        <p className="text-granito text-center mb-8 max-w-2xl mx-auto text-lg">
          Encuentra la propiedad ideal para ti. Contamos con una amplia variedad de opciones en Quetzaltenango.
        </p>

        {/* FILTROS */}
        <div className="max-w-4xl mx-auto mb-12 space-y-4">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-granito" />
            <input
              type="text"
              placeholder="Buscar por título, ubicación o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-niebla rounded-xl focus:outline-none focus:ring-2 focus:ring-cerro-verde shadow-sm"
            />
          </div>

          {/* TIPO FILTER */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilterTipo('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filterTipo === 'all'
                  ? 'bg-cerro-verde text-white shadow-md'
                  : 'bg-white text-granito hover:bg-slate-50 border border-niebla'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterTipo('Casa')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filterTipo === 'Casa'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-granito hover:bg-slate-50 border border-niebla'
              }`}
            >
              Casas
            </button>
            <button
              onClick={() => setFilterTipo('Apartamento')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filterTipo === 'Apartamento'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-white text-granito hover:bg-slate-50 border border-niebla'
              }`}
            >
              Apartamentos
            </button>
            <button
              onClick={() => setFilterTipo('Terreno')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filterTipo === 'Terreno'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white text-granito hover:bg-slate-50 border border-niebla'
              }`}
            >
              Terrenos
            </button>
          </div>
        </div>

        {/* PROPIEDADES GRID */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => handlePropertyClick(property.id)}
                style={{ viewTransitionName: `property-${property.id}` }}
                className="cursor-pointer"
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Home className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-xela-navy mb-2">
              No se encontraron propiedades
            </h3>
            <p className="text-granito">
              Intenta con otros filtros o términos de búsqueda
            </p>
          </div>
        )}
      </div>
    </main>
  );
}