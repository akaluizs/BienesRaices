'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
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
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContactosPage() {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');
  const [selectedContacto, setSelectedContacto] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    loadContactos();
  }, []);

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
      toast.success(`${data?.length || 0} contactos cargados`);
    } catch (error) {
      console.error('Error cargando contactos:', error);
      toast.error('Error al cargar contactos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEstado = async (id, nuevoEstado) => {
    const loadingToast = toast.loading('Actualizando estado...');
    
    try {
      const { error } = await supabase
        .from('contactos')
        .update({ estado: nuevoEstado })
        .eq('id', id);

      if (error) throw error;

      setContactos(contactos.map(c => 
        c.id === id ? { ...c, estado: nuevoEstado } : c
      ));
      
      toast.success('Estado actualizado correctamente', {
        id: loadingToast,
      });
    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast.error('Error al actualizar estado', {
        id: loadingToast,
      });
    }
  };

  const handleDelete = async (id) => {
    const loadingToast = toast.loading('Eliminando contacto...');
    
    try {
      const { error } = await supabase
        .from('contactos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContactos(contactos.filter(c => c.id !== id));
      setDeleteModal(null);
      
      toast.success('Contacto eliminado exitosamente', {
        id: loadingToast,
      });
    } catch (error) {
      console.error('Error eliminando contacto:', error);
      toast.error('Error al eliminar el contacto', {
        id: loadingToast,
      });
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
        return 'bg-blue-500';
      case 'contactado':
        return 'bg-yellow-500';
      case 'resuelto':
        return 'bg-green-500';
      case 'cancelado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cerro-verde" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-xela-navy">Contactos</h1>
        <p className="text-granito mt-1">Gestiona todos los mensajes de contacto</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-granito font-medium">Total</p>
              <p className="text-3xl font-bold text-xela-navy mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-granito font-medium">Nuevos</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.nuevos}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-granito font-medium">Contactados</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.contactados}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-granito font-medium">Resueltos</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.resueltos}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-granito" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o asunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-niebla rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde"
            />
          </div>

          {/* FILTER */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-granito" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-niebla rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde appearance-none bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="nuevo">Nuevos</option>
              <option value="contactado">Contactados</option>
              <option value="resuelto">Resueltos</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* LISTA DE CONTACTOS */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-niebla">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-granito">Cliente</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-granito">Asunto</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-granito">Propiedad</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-granito">Estado</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-granito">Fecha</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-granito">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredContactos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-granito">No se encontraron contactos</p>
                  </td>
                </tr>
              ) : (
                filteredContactos.map((contacto) => (
                  <tr key={contacto.id} className="border-b border-niebla hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cerro-verde/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-cerro-verde" />
                        </div>
                        <div>
                          <p className="font-semibold text-xela-navy">{contacto.nombre}</p>
                          <p className="text-sm text-granito">{contacto.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-xela-navy line-clamp-1">{contacto.asunto}</p>
                      <p className="text-sm text-granito line-clamp-1">{contacto.mensaje}</p>
                    </td>
                    <td className="px-6 py-4">
                      {contacto.propiedades ? (
                        <div>
                          <p className="font-medium text-xela-navy text-sm line-clamp-1">
                            {contacto.propiedades.titulo}
                          </p>
                          <p className="text-xs text-granito">
                            {contacto.propiedades.tipo} - Q{contacto.propiedades.precio?.toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-granito">Sin propiedad</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={contacto.estado}
                        onChange={(e) => handleChangeEstado(contacto.id, e.target.value)}
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-semibold text-white cursor-pointer',
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
                      <div className="flex items-center gap-2 text-sm text-granito">
                        <Clock className="w-4 h-4" />
                        {new Date(contacto.created_at).toLocaleDateString('es-GT', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setSelectedContacto(contacto)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(contacto)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETALLES */}
      {selectedContacto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-niebla">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-xela-navy">Detalles del Contacto</h3>
                <button
                  onClick={() => setSelectedContacto(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-granito" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* CLIENTE */}
              <div>
                <h4 className="font-semibold text-xela-navy mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información del Cliente
                </h4>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Nombre:</span> {selectedContacto.nombre}</p>
                  <p><span className="font-medium">Email:</span> {selectedContacto.email}</p>
                  <p><span className="font-medium">Teléfono:</span> {selectedContacto.telefono}</p>
                </div>
              </div>

              {/* MENSAJE */}
              <div>
                <h4 className="font-semibold text-xela-navy mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Mensaje
                </h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="font-medium mb-2">{selectedContacto.asunto}</p>
                  <p className="text-granito whitespace-pre-wrap">{selectedContacto.mensaje}</p>
                </div>
              </div>

              {/* PROPIEDAD */}
              {selectedContacto.propiedades && (
                <div>
                  <h4 className="font-semibold text-xela-navy mb-3 flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Propiedad de Interés
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="font-medium text-lg mb-1">{selectedContacto.propiedades.titulo}</p>
                    <p className="text-granito">
                      {selectedContacto.propiedades.tipo} - 
                      <span className="font-semibold text-cerro-verde ml-1">
                        Q{selectedContacto.propiedades.precio?.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* ESTADO Y FECHA */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-xela-navy mb-3">Estado</h4>
                  <select
                    value={selectedContacto.estado}
                    onChange={(e) => {
                      handleChangeEstado(selectedContacto.id, e.target.value);
                      setSelectedContacto({ ...selectedContacto, estado: e.target.value });
                    }}
                    className={cn(
                      'w-full px-4 py-2 rounded-lg text-white font-semibold',
                      getEstadoBadge(selectedContacto.estado)
                    )}
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="contactado">Contactado</option>
                    <option value="resuelto">Resuelto</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-xela-navy mb-3">Fecha</h4>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-granito">
                      {new Date(selectedContacto.created_at).toLocaleString('es-GT')}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACCIONES RÁPIDAS */}
              <div className="flex gap-3 pt-4">
                <a
                  href={`mailto:${selectedContacto.email}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
                  onClick={() => toast.info('Abriendo cliente de email...')}
                >
                  <Mail className="w-5 h-5" />
                  Enviar Email
                </a>
                <a
                  href={`tel:${selectedContacto.telefono}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
                  onClick={() => toast.info('Iniciando llamada...')}
                >
                  <Phone className="w-5 h-5" />
                  Llamar
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-xela-navy">Eliminar Contacto</h3>
                <p className="text-sm text-granito">Esta acción no se puede deshacer</p>
              </div>
            </div>
            
            <p className="text-granito mb-6">
              ¿Estás seguro de que deseas eliminar el contacto de <span className="font-bold">{deleteModal.nombre}</span>?
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