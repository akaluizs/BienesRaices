'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PropertyCard from '@/components/PropertyCard';
import { Search, Filter, Home, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PreventaPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos');
  const [selectedZone, setSelectedZone] = useState('todas');

  // Array de zonas
  const zones = ['todas', 'Zona 1', 'Zona 2', 'Zona 3', 'Zona 4', 'Zona 5', 'Zona 6', 'Zona 7', 'Zona 8', 'Zona 9', 'Zona 10', 'Zona 11', 'Zona 12'];

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, selectedType, selectedZone]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      // Filtrar solo propiedades con VentaPreventa = 'Preventa'
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('VentaPreventa', 'Preventa') // Solo Preventas
        .order('id', { ascending: false });

      if (error) throw error;

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
        parking: null,
        tipo: prop.tipo,
        VentaPreventa: prop.VentaPreventa,
        codigo: prop.codigo,
      }));

      setProperties(formattedProperties);
      setFilteredProperties(formattedProperties);
    } catch (error) {
      console.error('Error cargando propiedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(prop =>
        prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo
    if (selectedType !== 'todos') {
      filtered = filtered.filter(prop => prop.tipo === selectedType);
    }

    // Filtro por zona
    if (selectedZone !== 'todas') {
      filtered = filtered.filter(prop =>
        prop.location?.includes(selectedZone)
      );
    }

    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('todos');
    setSelectedZone('todas');
  };

  // Obtener tipos únicos
  const propertyTypes = ['todos', ...new Set(properties.map(p => p.tipo).filter(Boolean))];

  // Contar propiedades por zona
  const getZoneCount = (zone) => {
    if (zone === 'todas') return properties.length;
    return properties.filter(p => p.location?.includes(zone)).length;
  };

  return (
    <div className="min-h-screen bg-gris-claro">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-primary text-blanco py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blanco/10 backdrop-blur-md border border-amarillo-dorado/30 rounded-full px-6 py-2 mb-6">
              <Home className="w-5 h-5 text-amarillo-dorado" />
              <span className="text-blanco font-semibold text-sm">
                Proyectos en Construcción
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Preventas <span className="text-amarillo-dorado">Exclusivas</span>
            </h1>
            
            <p className="text-xl text-blanco/90 mb-8">
              Asegura tu propiedad antes de que se complete la construcción.
              Descubre nuestros proyectos en desarrollo con precios especiales.
            </p>

            {/* ESTADÍSTICAS RÁPIDAS */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-blanco/10 backdrop-blur-lg rounded-xl p-4 border border-blanco/20">
                <p className="text-3xl font-bold text-amarillo-dorado">{properties.length}</p>
                <p className="text-sm text-blanco/80">Proyectos</p>
              </div>
              <div className="bg-blanco/10 backdrop-blur-lg rounded-xl p-4 border border-blanco/20">
                <p className="text-3xl font-bold text-amarillo-dorado">{propertyTypes.length - 1}</p>
                <p className="text-sm text-blanco/80">Tipos</p>
              </div>
              <div className="bg-blanco/10 backdrop-blur-lg rounded-xl p-4 border border-blanco/20">
                <p className="text-3xl font-bold text-amarillo-dorado">{filteredProperties.length}</p>
                <p className="text-sm text-blanco/80">Resultados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTROS Y BÚSQUEDA */}
      <section className="py-8 bg-blanco shadow-md">
        <div className="container mx-auto px-4">
          
          {/* Barra de búsqueda y filtros principales */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            
            {/* Input de búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gris-oscuro/50" />
              <Input
                type="text"
                placeholder="Buscar por título, ubicación, código o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-base border-2 border-gris-medio focus:border-naranja rounded-xl"
              />
            </div>

            {/* Filtro por tipo */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full lg:w-48 py-6 border-2 border-gris-medio focus:border-naranja rounded-xl">
                <Home className="w-5 h-5 text-naranja mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent side="top" align="end" className="max-h-[300px]">
                {propertyTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === 'todos' ? 'Todos los Tipos' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por zona */}
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-full lg:w-48 py-6 border-2 border-gris-medio focus:border-naranja rounded-xl">
                <MapPin className="w-5 h-5 text-naranja mr-2" />
                <SelectValue placeholder="Zona" />
              </SelectTrigger>
              <SelectContent side="top" align="end" className="max-h-[300px]">
                {zones.map(zone => (
                  <SelectItem key={zone} value={zone}>
                    {zone === 'todas' ? 'Todas las Zonas' : `${zone} (${getZoneCount(zone)})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Botón limpiar filtros */}
            {(searchTerm || selectedType !== 'todos' || selectedZone !== 'todas') && (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-2 border-naranja text-naranja hover:bg-naranja hover:text-blanco py-6 rounded-xl font-bold transition-all"
              >
                <Filter className="w-5 h-5 mr-2" />
                Limpiar
              </Button>
            )}
          </div>

          {/* Contador de resultados y filtros activos */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-gris-oscuro font-semibold">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'proyecto encontrado' : 'proyectos encontrados'}
            </p>
            
            {(searchTerm || selectedType !== 'todos' || selectedZone !== 'todas') && (
              <div className="flex items-center gap-2 text-sm text-gris-oscuro/70 flex-wrap">
                <span className="font-medium">Filtros activos:</span>
                {searchTerm && (
                  <span className="bg-naranja/10 text-naranja px-3 py-1 rounded-full text-xs font-semibold">
                    Búsqueda: "{searchTerm}"
                  </span>
                )}
                {selectedType !== 'todos' && (
                  <span className="bg-naranja/10 text-naranja px-3 py-1 rounded-full text-xs font-semibold">
                    {selectedType}
                  </span>
                )}
                {selectedZone !== 'todas' && (
                  <span className="bg-naranja/10 text-naranja px-3 py-1 rounded-full text-xs font-semibold">
                    {selectedZone}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LISTADO DE PROPIEDADES */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-16 h-16 animate-spin text-naranja mb-4" />
              <p className="text-gris-oscuro text-lg font-semibold">Cargando proyectos...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gris-claro rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gris-oscuro/50" />
                </div>
                <h3 className="text-2xl font-bold text-gris-oscuro mb-4">
                  No se encontraron proyectos
                </h3>
                <p className="text-gris-oscuro/70 mb-6">
                  Intenta ajustar los filtros o realiza una nueva búsqueda
                </p>
                <Button
                  onClick={clearFilters}
                  className="btn-cta px-8 py-3 rounded-xl font-bold shadow-naranja"
                >
                  Limpiar Filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}