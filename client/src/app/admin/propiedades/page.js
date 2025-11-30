'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  DollarSign,
  Home,
  Loader2,
  Bed,
  Bath,
  Maximize,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function PropiedadesPage() {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    loadPropiedades();
  }, []);

  const loadPropiedades = async () => {
    try {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error completo:', error);
        throw error;
      }

      console.log('Propiedades cargadas:', data);
      setPropiedades(data || []);
    } catch (error) {
      console.error('Error cargando propiedades:', error);
      alert('Error al cargar propiedades: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('propiedades')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPropiedades(propiedades.filter(p => p.id !== id));
      setDeleteModal(null);
      alert('Propiedad eliminada exitosamente');
    } catch (error) {
      console.error('Error eliminando propiedad:', error);
      alert('Error al eliminar la propiedad: ' + error.message);
    }
  };

  const filteredPropiedades = propiedades.filter(prop => {
    const matchesSearch = prop.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prop.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Función para obtener el color del badge según el tipo
  const getTipoBadgeColor = (tipo) => {
    switch(tipo) {
      case 'Casa':
        return 'bg-blue-500';
      case 'Apartamento':
        return 'bg-purple-500';
      case 'Terreno':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cerro-verde" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-xela-navy">Propiedades</h1>
          <p className="text-granito mt-1">Gestiona todas las propiedades del sistema</p>
        </div>
        <Link href="/admin/propiedades/nueva">
          <button className="flex items-center gap-2 bg-cerro-verde hover:bg-xela-navy text-white px-6 py-3 rounded-lg transition-colors shadow-md">
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Nueva Propiedad</span>
          </button>
        </Link>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-granito" />
          <input
            type="text"
            placeholder="Buscar por título o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-niebla rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-granito font-medium">Total de Propiedades</p>
            <p className="text-3xl font-bold text-xela-navy mt-1">
              {propiedades.length}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Home className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* PROPIEDADES LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPropiedades.map((propiedad) => (
          <div key={propiedad.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            {/* IMAGE */}
            <div className="relative h-48 bg-slate-200">
              {propiedad.imagenes && propiedad.imagenes.length > 0 ? (
                <img 
                  src={propiedad.imagenes[0]} 
                  alt={propiedad.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-16 h-16 text-slate-400" />
                </div>
              )}
              
              {/* TIPO BADGE */}
              {propiedad.tipo && (
                <div className={cn(
                  'absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white',
                  getTipoBadgeColor(propiedad.tipo)
                )}>
                  {propiedad.tipo}
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-xela-navy line-clamp-1 flex-1">
                  {propiedad.titulo}
                </h3>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-granito">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{propiedad.ubicacion}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-granito">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-bold text-cerro-verde text-lg">
                    Q{propiedad.precio?.toLocaleString()}
                  </span>
                </div>
                
                {/* SPECS */}
                <div className="flex items-center gap-4 text-xs text-granito pt-2">
                  {propiedad.tipo !== 'Terreno' && (
                    <>
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{propiedad.habitaciones || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{propiedad.banos || 0}</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    <span>{propiedad.metros2 || 0}m²</span>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <Link href={`/propiedades/${propiedad.id}`} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-granito px-3 py-2 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Ver</span>
                  </button>
                </Link>
                
                <Link href={`/admin/propiedades/editar/${propiedad.id}`} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">Editar</span>
                  </button>
                </Link>

                <button
                  onClick={() => setDeleteModal(propiedad)}
                  className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPropiedades.length === 0 && (
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl text-granito">No se encontraron propiedades</p>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-xela-navy">Eliminar Propiedad</h3>
                <p className="text-sm text-granito">Esta acción no se puede deshacer</p>
              </div>
            </div>
            
            <p className="text-granito mb-6">
              ¿Estás seguro de que deseas eliminar <span className="font-bold">{deleteModal.titulo}</span>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-3 border border-niebla rounded-lg font-medium text-granito hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteModal.id)}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}