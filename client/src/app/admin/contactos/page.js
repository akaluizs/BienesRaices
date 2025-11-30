'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Mail, 
  Phone, 
  User, 
  Clock, 
  MessageSquare,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Filter,
  Home,
  AlertCircle,
  Send
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

export default function ContactosPage() {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');
  const [selectedContacto, setSelectedContacto] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadContactos();
  }, []);

  const showAlert = (type, message, description = '') => {
    setAlert({ type, message, description });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadContactos = async () => {
    try {
      const { data, error } = await supabase
        .from('contactos')
        .select(`
          *,
          propiedades (
            id,
            titulo,
            tipo,
            precio
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContactos(data || []);
      showAlert('success', `${data?.length || 0} contactos cargados`);
    } catch (error) {
      console.error('Error cargando contactos:', error);
      showAlert('error', 'Error al cargar contactos', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      const { error } = await supabase
        .from('contactos')
        .update({ estado: nuevoEstado })
        .eq('id', id);

      if (error) throw error;

      setContactos(contactos.map(c => 
        c.id === id ? { ...c, estado: nuevoEstado } : c
      ));
      
      showAlert('success', 'Estado actualizado correctamente');
      
      // Actualizar modal si está abierto
      if (selectedContacto?.id === id) {
        setSelectedContacto({ ...selectedContacto, estado: nuevoEstado });
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
      showAlert('error', 'Error al actualizar estado', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('contactos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContactos(contactos.filter(c => c.id !== id));
      setDeleteModal(null);
      showAlert('success', 'Contacto eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando contacto:', error);
      showAlert('error', 'Error al eliminar el contacto', error.message);
    }
  };

  const filteredContactos = contactos.filter(contacto => {
    const matchesSearch = 
      contacto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacto.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacto.asunto?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filterEstado === 'all' || contacto.estado === filterEstado;
    
    return matchesSearch && matchesEstado;
  });

  const getEstadoBadge = (estado) => {
    switch(estado) {
      case 'nuevo':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'contactado':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'resuelto':
        return 'bg-green-500 hover:bg-green-600';
      case 'cancelado':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gris-medio hover:bg-gris-oscuro';
    }
  };

  const stats = {
    total: contactos.length,
    nuevos: contactos.filter(c => c.estado === 'nuevo').length,
    contactados: contactos.filter(c => c.estado === 'contactado').length,
    resueltos: contactos.filter(c => c.estado === 'resuelto').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-16 h-16 animate-spin text-naranja mb-4" />
        <p className="text-gris-oscuro text-lg font-semibold">Cargando contactos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gris-oscuro flex items-center gap-3">
          <MessageSquare className="w-9 h-9 text-naranja" />
          Contactos
        </h1>
        <p className="text-gris-oscuro/70 mt-2 text-lg">
          Gestiona todos los mensajes de contacto
        </p>
      </div>

      {/* ALERT */}
      {alert && (
        <Alert className={`border-2 ${
          alert.type === 'success' ? 'bg-green-50 border-green-500' :
          alert.type === 'error' ? 'bg-red-50 border-red-500' :
          'bg-yellow-50 border-yellow-500'
        }`}>
          {alert.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <AlertDescription className={`font-semibold ml-2 ${
            alert.type === 'success' ? 'text-green-800' :
            alert.type === 'error' ? 'text-red-800' :
            'text-yellow-800'
          }`}>
            <div className="font-bold">{alert.message}</div>
            {alert.description && (
              <div className="text-sm font-normal mt-1">{alert.description}</div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-2 border-gris-medio hover:border-naranja transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gris-oscuro/70 mb-1">Total</p>
                <p className="text-3xl font-extrabold text-naranja">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-naranja">
                <MessageSquare className="w-7 h-7 text-blanco" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gris-medio hover:border-blue-500 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gris-oscuro/70 mb-1">Nuevos</p>
                <p className="text-3xl font-extrabold text-blue-500">{stats.nuevos}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Mail className="w-7 h-7 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gris-medio hover:border-yellow-500 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gris-oscuro/70 mb-1">Contactados</p>
                <p className="text-3xl font-extrabold text-yellow-500">{stats.contactados}</p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <Phone className="w-7 h-7 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gris-medio hover:border-green-500 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gris-oscuro/70 mb-1">Resueltos</p>
                <p className="text-3xl font-extrabold text-green-500">{stats.resueltos}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTROS */}
      <Card className="border-2 border-gris-medio">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gris-oscuro/50" />
              <Input
                type="text"
                placeholder="Buscar por nombre, email o asunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-base border-2 border-gris-medio focus:border-naranja rounded-xl"
              />
            </div>

            {/* FILTER */}
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="border-2 border-gris-medio focus:border-naranja py-6 rounded-xl bg-blanco">
                <Filter className="w-5 h-5 text-naranja mr-2" />
                <SelectValue placeholder="Estado del contacto" />
              </SelectTrigger>
              <SelectContent 
                className="!bg-blanco !opacity-100 border-2 border-gris-medio shadow-2xl"
                style={{ backgroundColor: '#FFFFFF', backdropFilter: 'none', opacity: 1 }}
              >
                <SelectItem value="all" className="!bg-blanco hover:!bg-gris-claro cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
                  Todos los estados
                </SelectItem>
                <SelectItem value="nuevo" className="!bg-blanco hover:!bg-gris-claro cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
                  Nuevos
                </SelectItem>
                <SelectItem value="contactado" className="!bg-blanco hover:!bg-gris-claro cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
                  Contactados
                </SelectItem>
                <SelectItem value="resuelto" className="!bg-blanco hover:!bg-gris-claro cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
                  Resueltos
                </SelectItem>
                <SelectItem value="cancelado" className="!bg-blanco hover:!bg-gris-claro cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
                  Cancelados
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4">
            <p className="text-gris-oscuro font-semibold">
              {filteredContactos.length} {filteredContactos.length === 1 ? 'contacto encontrado' : 'contactos encontrados'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* LISTA DE CONTACTOS */}
      <Card className="border-2 border-gris-medio overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-naranja/10 to-amarillo-dorado/10 border-b-2 border-gris-medio">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-bold text-gris-oscuro">Cliente</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gris-oscuro">Asunto</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gris-oscuro">Propiedad</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gris-oscuro">Estado</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gris-oscuro">Fecha</th>
                <th className="text-right px-6 py-4 text-sm font-bold text-gris-oscuro">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredContactos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gris-oscuro/30 mx-auto mb-3" />
                    <p className="text-gris-oscuro/70 font-semibold">No se encontraron contactos</p>
                  </td>
                </tr>
              ) : (
                filteredContactos.map((contacto) => (
                  <tr key={contacto.id} className="border-b border-gris-medio hover:bg-naranja/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-cta rounded-full flex items-center justify-center shadow-naranja">
                          <User className="w-5 h-5 text-blanco" />
                        </div>
                        <div>
                          <p className="font-semibold text-gris-oscuro">{contacto.nombre}</p>
                          <p className="text-sm text-gris-oscuro/70">{contacto.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gris-oscuro line-clamp-1">{contacto.asunto}</p>
                      <p className="text-sm text-gris-oscuro/70 line-clamp-1">{contacto.mensaje}</p>
                    </td>
                    <td className="px-6 py-4">
                      {contacto.propiedades ? (
                        <div>
                          <p className="font-medium text-gris-oscuro text-sm line-clamp-1">
                            {contacto.propiedades.titulo}
                          </p>
                          <p className="text-xs text-gris-oscuro/70">
                            {contacto.propiedades.tipo} - <span className="text-naranja font-bold">Q{contacto.propiedades.precio?.toLocaleString()}</span>
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-gris-oscuro/70">Sin propiedad</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={contacto.estado}
                        onChange={(e) => handleChangeEstado(contacto.id, e.target.value)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-bold text-blanco cursor-pointer border-0 shadow-md transition-all',
                          getEstadoBadge(contacto.estado)
                        )}
                      >
                        <option value="nuevo">Nuevo</option>
                        <option value="contactado">Contactado</option>
                        <option value="resuelto">Resuelto</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gris-oscuro/70">
                        <Clock className="w-4 h-4 text-naranja" />
                        {new Date(contacto.created_at).toLocaleDateString('es-GT', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSelectedContacto(contacto)}
                          className="border-2 border-gris-medio hover:border-blue-500 hover:bg-blue-50 text-blue-600 rounded-xl"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDeleteModal(contacto)}
                          className="border-2 border-gris-medio hover:border-red-500 hover:bg-red-50 text-red-600 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL DETALLES */}
      {selectedContacto && (
        <div className="fixed inset-0 bg-gris-oscuro/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gris-medio shadow-2xl">
            <div className="p-6 border-b-2 border-gris-medio bg-gradient-to-r from-naranja/10 to-amarillo-dorado/10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gris-oscuro flex items-center gap-3">
                  <MessageSquare className="w-7 h-7 text-naranja" />
                  Detalles del Contacto
                </h3>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedContacto(null)}
                  className="border-2 border-gris-medio hover:border-red-500 hover:bg-red-50 text-red-600 rounded-xl"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* CLIENTE */}
              <div>
                <h4 className="font-bold text-gris-oscuro mb-3 flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-naranja" />
                  Información del Cliente
                </h4>
                <Card className="bg-naranja/5 border-2 border-naranja/20">
                  <CardContent className="p-4 space-y-2 text-sm">
                    <p><span className="font-semibold text-gris-oscuro">Nombre:</span> <span className="text-gris-oscuro/80">{selectedContacto.nombre}</span></p>
                    <p><span className="font-semibold text-gris-oscuro">Email:</span> <span className="text-gris-oscuro/80">{selectedContacto.email}</span></p>
                    <p><span className="font-semibold text-gris-oscuro">Teléfono:</span> <span className="text-gris-oscuro/80">{selectedContacto.telefono}</span></p>
                  </CardContent>
                </Card>
              </div>

              {/* MENSAJE */}
              <div>
                <h4 className="font-bold text-gris-oscuro mb-3 flex items-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5 text-naranja" />
                  Mensaje
                </h4>
                <Card className="bg-amarillo-dorado/5 border-2 border-amarillo-dorado/20">
                  <CardContent className="p-4">
                    <p className="font-semibold text-gris-oscuro mb-2">{selectedContacto.asunto}</p>
                    <p className="text-gris-oscuro/80 whitespace-pre-wrap text-sm">{selectedContacto.mensaje}</p>
                  </CardContent>
                </Card>
              </div>

              {/* PROPIEDAD */}
              {selectedContacto.propiedades && (
                <div>
                  <h4 className="font-bold text-gris-oscuro mb-3 flex items-center gap-2 text-lg">
                    <Home className="w-5 h-5 text-naranja" />
                    Propiedad de Interés
                  </h4>
                  <Card className="bg-blue-50 border-2 border-blue-200">
                    <CardContent className="p-4">
                      <p className="font-bold text-gris-oscuro text-lg mb-1">{selectedContacto.propiedades.titulo}</p>
                      <p className="text-gris-oscuro/80 text-sm">
                        {selectedContacto.propiedades.tipo} - 
                        <span className="font-extrabold text-naranja ml-1">
                          Q{selectedContacto.propiedades.precio?.toLocaleString()}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ESTADO Y FECHA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-gris-oscuro mb-3">Estado</h4>
                  <select
                    value={selectedContacto.estado}
                    onChange={(e) => handleChangeEstado(selectedContacto.id, e.target.value)}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl text-blanco font-bold border-0 shadow-md cursor-pointer',
                      getEstadoBadge(selectedContacto.estado)
                    )}
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="contactado">Contactado</option>
                    <option value="resuelto">Resuelto</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div>
                  <h4 className="font-bold text-gris-oscuro mb-3">Fecha de Contacto</h4>
                  <Card className="bg-gris-claro border-2 border-gris-medio">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-naranja" />
                        <p className="text-gris-oscuro font-semibold">
                          {new Date(selectedContacto.created_at).toLocaleString('es-GT')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* ACCIONES RÁPIDAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                <a
                  href={`mailto:${selectedContacto.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-blanco rounded-xl font-bold py-6 shadow-lg">
                    <Mail className="w-5 h-5 mr-2" />
                    Enviar Email
                  </Button>
                </a>
                <a
                  href={`tel:${selectedContacto.telefono}`}
                >
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-blanco rounded-xl font-bold py-6 shadow-lg">
                    <Phone className="w-5 h-5 mr-2" />
                    Llamar
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {deleteModal && (
        <div className="fixed inset-0 bg-gris-oscuro/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full border-2 border-gris-medio shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gris-oscuro">Eliminar Contacto</h3>
                  <p className="text-sm text-gris-oscuro/70">Esta acción no se puede deshacer</p>
                </div>
              </div>
              
              <p className="text-gris-oscuro mb-6">
                ¿Estás seguro de que deseas eliminar el contacto de{' '}
                <span className="font-bold text-naranja">{deleteModal.nombre}</span>?
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 border-2 border-gris-medio hover:bg-gris-claro rounded-xl font-bold py-6"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleDelete(deleteModal.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-blanco rounded-xl font-bold py-6 shadow-lg"
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