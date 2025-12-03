'use client';

import { useState, useCallback } from 'react';
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
  Bed,
  Bath,
  Maximize,
  Building2,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { deleteProperty } from '@/lib/actions/propertyActions';

export default function PropiedadesListClient({ propiedadesIniciales, onRevalidate }) {
  const [propiedades, setPropiedades] = useState(propiedadesIniciales);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [deleteModal, setDeleteModal] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [revalidating, setRevalidating] = useState(false);
  const [message, setMessage] = useState(null);

  // ✅ SIN MEMO: Recalcula siempre (sin caché agresivo)
  const filteredPropiedades = propiedades.filter(prop => {
    const matchesSearch = 
      prop.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterTipo === 'todos' || prop.tipo === filterTipo;
    
    return matchesSearch && matchesType;
  });

  // ✅ SIN MEMO: Recalcula siempre
  const stats = {
    total: propiedades.length,
    casas: propiedades.filter(p => p.tipo === 'Casa').length,
    apartamentos: propiedades.filter(p => p.tipo === 'Apartamento').length,
    terrenos: propiedades.filter(p => p.tipo === 'Terreno').length,
    comerciales: propiedades.filter(p => p.tipo === 'Local Comercial').length,
  };

  // ✅ FUNCIÓN MEMOIZADA: Obtener color de badge por tipo
  const getTipoBadgeColor = useCallback((tipo) => {
    const colors = {
      'Casa': 'bg-blue-500 hover:bg-blue-600',
      'Apartamento': 'bg-purple-500 hover:bg-purple-600',
      'Terreno': 'bg-green-500 hover:bg-green-600',
      'Local Comercial': 'bg-orange-500 hover:bg-orange-600',
    };
    return colors[tipo] || 'bg-gris-medio hover:bg-gris-oscuro';
  }, []);

  // Eliminar propiedad
  const handleDelete = useCallback(async (id) => {
    try {
      setLoadingDelete(id);
      console.log(`🗑️ Eliminando propiedad: ${id}`);
      
      const result = await deleteProperty(id);
      
      if (result.success) {
        // ✅ Eliminar del estado local
        setPropiedades(prev => {
          const nuevas = prev.filter(p => p.id !== id);
          console.log(`📉 Propiedades antes: ${prev.length}, después: ${nuevas.length}`);
          return nuevas;
        });
        
        setDeleteModal(null);
        setMessage({ type: 'success', text: '✅ Propiedad eliminada exitosamente' });
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: `❌ Error: ${result.error}` });
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setLoadingDelete(null);
    }
  }, []);

  // Revalidar caché
  const handleRevalidate = useCallback(async () => {
    try {
      setRevalidating(true);
      console.log('🔄 Iniciando revalidación de caché...');
      
      const result = await onRevalidate();
      
      if (result?.success) {
        setMessage({ type: 'success', text: '✅ Caché revalidado correctamente' });
      } else {
        setMessage({ type: 'error', text: `❌ Error: ${result?.error || 'Error desconocido'}` });
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error revalidando:', error);
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setRevalidating(false);
    }
  }, [onRevalidate]);

  // ✅ FUNCIÓN MEMOIZADA: Abrir modal de eliminación
  const openDeleteModal = useCallback((propiedad) => {
    setDeleteModal(propiedad);
  }, []);

  // ✅ FUNCIÓN MEMOIZADA: Cerrar modal de eliminación
  const closeDeleteModal = useCallback(() => {
    setDeleteModal(null);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* MENSAJES */}
      {message && (
        <div className={`p-4 rounded-lg border-2 flex items-center gap-3 animate-in fade-in-50 ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <p className={message.type === 'success' ? 'text-green-900 font-semibold' : 'text-red-900 font-semibold'}>
            {message.text}
          </p>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gris-oscuro flex items-center gap-3">
            <Home className="w-9 h-9 text-naranja" />
            Propiedades
          </h1>
          <p className="text-gris-oscuro/70 mt-2 text-lg">
            Gestiona todas las propiedades del sistema 
            <span className="font-bold text-naranja ml-2">({stats.total})</span>
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleRevalidate}
            disabled={revalidating}
            variant="outline"
            className="border-2 border-gris-medio hover:border-blue-500 hover:bg-blue-50 rounded-xl font-bold px-6 py-6"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${revalidating ? 'animate-spin' : ''}`} />
            {revalidating ? 'Revalidando...' : 'Revalidar Caché'}
          </Button>

          <Link href="/admin/propiedades/nueva">
            <Button className="btn-cta px-6 py-6 rounded-xl font-bold text-base shadow-naranja group">
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
              Nueva Propiedad
            </Button>
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: '🏠', color: 'bg-blue-50 border-blue-200' },
          { label: 'Casas', value: stats.casas, icon: '🏡', color: 'bg-green-50 border-green-200' },
          { label: 'Apartamentos', value: stats.apartamentos, icon: '🏢', color: 'bg-purple-50 border-purple-200' },
          { label: 'Terrenos', value: stats.terrenos, icon: '🌱', color: 'bg-amber-50 border-amber-200' },
          { label: 'Comerciales', value: stats.comerciales, icon: '🏪', color: 'bg-orange-50 border-orange-200' },
        ].map((stat) => (
          <Card key={stat.label} className={`border-2 ${stat.color} hover:shadow-md transition-shadow`}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl mb-1">{stat.icon}</p>
                <p className="text-xs font-bold text-gris-oscuro">{stat.label}</p>
                <p className="text-2xl font-extrabold text-naranja">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SEARCH Y FILTROS */}
      <Card className="border-2 border-gris-medio">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gris-oscuro/50" />
              <Input
                type="text"
                placeholder="Buscar por título o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-base border-2 border-gris-medio focus:border-naranja rounded-xl transition-colors"
              />
            </div>
            
            {/* Filtro por tipo */}
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'todos', label: 'Todos' },
                { value: 'Casa', label: '🏡 Casas' },
                { value: 'Apartamento', label: '🏢 Apartamentos' },
                { value: 'Terreno', label: '🌱 Terrenos' },
                { value: 'Local Comercial', label: '🏪 Comerciales' },
              ].map((tipo) => (
                <Button
                  key={tipo.value}
                  onClick={() => setFilterTipo(tipo.value)}
                  variant={filterTipo === tipo.value ? 'default' : 'outline'}
                  className={`rounded-xl font-bold transition-all ${
                    filterTipo === tipo.value
                      ? 'btn-cta shadow-naranja'
                      : 'border-2 border-gris-medio hover:border-naranja'
                  }`}
                >
                  {tipo.label}
                </Button>
              ))}
            </div>

            {/* Contador de resultados */}
            <p className="text-sm text-gris-oscuro/70 font-semibold">
              Mostrando <span className="text-naranja">{filteredPropiedades.length}</span> de <span className="text-naranja">{stats.total}</span> propiedades
            </p>
          </div>
        </CardContent>
      </Card>

      {/* GRID DE PROPIEDADES */}
      {filteredPropiedades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPropiedades.map((propiedad, index) => (
            <Card 
              key={propiedad.id} 
              className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group overflow-hidden"
            >
              
              {/* IMAGEN */}
              <div className="relative h-48 bg-gris-medio overflow-hidden">
                {propiedad.imagen ? (
                  <Image 
                    src={propiedad.imagen} 
                    alt={propiedad.titulo}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority={index < 3}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gris-claro to-gris-medio">
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

                {/* Badge precio */}
                <Badge className="absolute bottom-3 right-3 bg-naranja text-blanco font-bold text-lg shadow-lg">
                  Q {propiedad.precio?.toLocaleString() || '0'}
                </Badge>
              </div>

              <CardContent className="p-5">
                
                {/* Título */}
                <h3 className="text-lg font-bold text-gris-oscuro mb-3 line-clamp-2 group-hover:text-naranja transition-colors">
                  {propiedad.titulo}
                </h3>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gris-oscuro/70">
                    <MapPin className="w-4 h-4 text-naranja flex-shrink-0" />
                    <span className="line-clamp-1">{propiedad.ubicacion}</span>
                  </div>
                  
                  {/* Specs */}
                  {propiedad.tipo !== 'Terreno' && (
                    <div className="flex items-center gap-4 text-sm text-gris-oscuro/70 pt-2 border-t border-gris-medio">
                      {propiedad.habitaciones > 0 && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-naranja" />
                          <span className="font-semibold">{propiedad.habitaciones}</span>
                        </div>
                      )}
                      {propiedad.banos > 0 && (
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4 text-naranja" />
                          <span className="font-semibold">{propiedad.banos}</span>
                        </div>
                      )}
                      {propiedad.metros2 > 0 && (
                        <div className="flex items-center gap-1">
                          <Maximize className="w-4 h-4 text-naranja" />
                          <span className="font-semibold">{propiedad.metros2}m²</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {propiedad.tipo === 'Terreno' && propiedad.metros2 > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gris-oscuro/70 pt-2 border-t border-gris-medio">
                      <Maximize className="w-4 h-4 text-naranja" />
                      <span className="font-semibold">{propiedad.metros2}m²</span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="grid grid-cols-3 gap-2">
                  <Link href={`/propiedades/${propiedad.id}`}>
                    <Button 
                      variant="outline"
                      className="w-full border-2 border-gris-medio hover:border-blue-500 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors"
                      size="sm"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  
                  <Link href={`/admin/propiedades/editar/${propiedad.id}`}>
                    <Button 
                      variant="outline"
                      className="w-full border-2 border-gris-medio hover:border-naranja hover:bg-naranja/10 text-naranja rounded-xl transition-colors"
                      size="sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    onClick={() => openDeleteModal(propiedad)}
                    className="w-full border-2 border-gris-medio hover:border-red-500 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                    size="sm"
                    disabled={loadingDelete === propiedad.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <Card className="border-2 border-gris-medio bg-gris-claro">
          <CardContent className="py-20 text-center">
            <div className="w-20 h-20 bg-blanco rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Home className="w-10 h-10 text-gris-oscuro/50" />
            </div>
            <h3 className="text-2xl font-bold text-gris-oscuro mb-3">
              No se encontraron propiedades
            </h3>
            <p className="text-gris-oscuro/70 mb-6">
              {searchTerm 
                ? '🔍 Intenta ajustar la búsqueda o filtros' 
                : '🏠 Comienza agregando tu primera propiedad'}
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
        <div className="fixed inset-0 bg-gris-oscuro/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-50">
          <Card className="max-w-md w-full border-2 border-gris-medio shadow-2xl bg-blanco animate-in zoom-in-95">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gris-oscuro">Eliminar Propiedad</h3>
                  <p className="text-sm text-gris-oscuro/70">Esta acción no se puede deshacer</p>
                </div>
              </div>
              
              <p className="text-gris-oscuro mb-6">
                ¿Estás seguro de que deseas eliminar{' '}
                <span className="font-bold text-naranja">"{deleteModal.titulo}"</span>?
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={closeDeleteModal}
                  disabled={loadingDelete === deleteModal.id}
                  className="flex-1 border-2 border-gris-medio hover:bg-gris-claro rounded-xl font-bold disabled:opacity-50"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleDelete(deleteModal.id)}
                  disabled={loadingDelete === deleteModal.id}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-blanco rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all"
                >
                  {loadingDelete === deleteModal.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}