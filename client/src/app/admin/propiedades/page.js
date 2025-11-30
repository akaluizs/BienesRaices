'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
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
  Building2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  const getTipoBadgeColor = (tipo) => {
    switch(tipo) {
      case 'Casa':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'Apartamento':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'Terreno':
        return 'bg-green-500 hover:bg-green-600';
      case 'Local Comercial':
        return 'bg-orange-500 hover:bg-orange-600';
      default:
        return 'bg-gris-medio hover:bg-gris-oscuro';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-16 h-16 animate-spin text-naranja mb-4" />
        <p className="text-gris-oscuro text-lg font-semibold">Cargando propiedades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gris-oscuro flex items-center gap-3">
            <Home className="w-9 h-9 text-naranja" />
            Propiedades
          </h1>
          <p className="text-gris-oscuro/70 mt-2 text-lg">
            Gestiona todas las propiedades del sistema
          </p>
        </div>

        <Link href="/admin/propiedades/nueva">
          <Button className="btn-cta px-6 py-6 rounded-xl font-bold text-base shadow-naranja group">
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
            Nueva Propiedad
          </Button>
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-gris-medio hover:border-naranja transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gris-oscuro/70 mb-1">Total Propiedades</p>
                <p className="text-3xl font-extrabold text-naranja">{propiedades.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-naranja">
                <Home className="w-7 h-7 text-blanco" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gris-medio hover:border-blue-500 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gris-oscuro/70 mb-1">Casas</p>
                <p className="text-3xl font-extrabold text-blue-500">
                  {propiedades.filter(p => p.tipo === 'Casa').length}
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Home className="w-7 h-7 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gris-medio hover:border-purple-500 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gris-oscuro/70 mb-1">Apartamentos</p>
                <p className="text-3xl font-extrabold text-purple-500">
                  {propiedades.filter(p => p.tipo === 'Apartamento').length}
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH */}
      <Card className="border-2 border-gris-medio">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gris-oscuro/50" />
            <Input
              type="text"
              placeholder="Buscar por título o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-6 text-base border-2 border-gris-medio focus:border-naranja rounded-xl"
            />
          </div>
          
          <div className="mt-4">
            <p className="text-gris-oscuro font-semibold">
              {filteredPropiedades.length} {filteredPropiedades.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* GRID PROPIEDADES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPropiedades.map((propiedad) => (
          <Card key={propiedad.id} className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group overflow-hidden">
            
            {/* Imagen */}
            <div className="relative h-48 bg-gris-medio">
              {propiedad.imagenes && propiedad.imagenes.length > 0 ? (
                <Image 
                  src={propiedad.imagenes[0]} 
                  alt={propiedad.titulo}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-16 h-16 text-gris-oscuro/30" />
                </div>
              )}
              
              {/* Badge tipo */}
              {propiedad.tipo && (
                <Badge className={cn(
                  'absolute top-3 right-3 text-blanco font-bold border-0 shadow-lg',
                  getTipoBadgeColor(propiedad.tipo)
                )}>
                  {propiedad.tipo}
                </Badge>
              )}
            </div>

            <CardContent className="p-5">
              
              {/* Título */}
              <h3 className="text-lg font-bold text-gris-oscuro mb-3 line-clamp-1 group-hover:text-naranja transition-colors">
                {propiedad.titulo}
              </h3>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gris-oscuro/70">
                  <MapPin className="w-4 h-4 text-naranja" />
                  <span className="line-clamp-1">{propiedad.ubicacion}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amarillo-dorado" />
                  <span className="font-extrabold text-naranja text-xl">
                    Q{propiedad.precio?.toLocaleString()}
                  </span>
                </div>
                
                {/* Specs */}
                {propiedad.tipo !== 'Terreno' && (
                  <div className="flex items-center gap-4 text-sm text-gris-oscuro/70 pt-2 border-t border-gris-medio">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4 text-naranja" />
                      <span className="font-semibold">{propiedad.habitaciones || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4 text-naranja" />
                      <span className="font-semibold">{propiedad.banos || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="w-4 h-4 text-naranja" />
                      <span className="font-semibold">{propiedad.metros2 || 0}m²</span>
                    </div>
                  </div>
                )}
                
                {propiedad.tipo === 'Terreno' && (
                  <div className="flex items-center gap-2 text-sm text-gris-oscuro/70 pt-2 border-t border-gris-medio">
                    <Maximize className="w-4 h-4 text-naranja" />
                    <span className="font-semibold">{propiedad.metros2 || 0}m²</span>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="grid grid-cols-3 gap-2">
                <Link href={`/propiedades/${propiedad.id}`}>
                  <Button 
                    variant="outline"
                    className="w-full border-2 border-gris-medio hover:border-blue-500 hover:bg-blue-50 text-blue-600 rounded-xl"
                    size="sm"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                
                <Link href={`/admin/propiedades/editar/${propiedad.id}`}>
                  <Button 
                    variant="outline"
                    className="w-full border-2 border-gris-medio hover:border-naranja hover:bg-naranja/10 text-naranja rounded-xl"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => setDeleteModal(propiedad)}
                  className="w-full border-2 border-gris-medio hover:border-red-500 hover:bg-red-50 text-red-600 rounded-xl"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredPropiedades.length === 0 && (
        <Card className="border-2 border-gris-medio">
          <CardContent className="py-20 text-center">
            <div className="w-20 h-20 bg-gris-claro rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-10 h-10 text-gris-oscuro/50" />
            </div>
            <h3 className="text-2xl font-bold text-gris-oscuro mb-3">
              No se encontraron propiedades
            </h3>
            <p className="text-gris-oscuro/70 mb-6">
              {searchTerm 
                ? 'Intenta ajustar la búsqueda' 
                : 'Comienza agregando tu primera propiedad'}
            </p>
            <Link href="/admin/propiedades/nueva">
              <Button className="btn-cta px-8 py-3 rounded-xl font-bold shadow-naranja">
                <Plus className="w-5 h-5 mr-2" />
                Nueva Propiedad
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 bg-gris-oscuro/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full border-2 border-gris-medio shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gris-oscuro">Eliminar Propiedad</h3>
                  <p className="text-sm text-gris-oscuro/70">Esta acción no se puede deshacer</p>
                </div>
              </div>
              
              <p className="text-gris-oscuro mb-6">
                ¿Estás seguro de que deseas eliminar{' '}
                <span className="font-bold text-naranja">{deleteModal.titulo}</span>?
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 border-2 border-gris-medio hover:bg-gris-claro rounded-xl font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleDelete(deleteModal.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-blanco rounded-xl font-bold shadow-lg"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}