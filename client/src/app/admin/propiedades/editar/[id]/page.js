'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Upload,
  X,
  Loader2,
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Maximize,
  FileText,
  Image as ImageIcon,
  Building2
} from 'lucide-react';
import Link from 'next/link';

export default function EditarPropiedadPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    precio: '',
    ubicacion: '',
    descripcion: '',
    habitaciones: '',
    banos: '',
    metros2: '',
    imagenes: []
  });

  useEffect(() => {
    loadPropiedad();
  }, [id]);

  const loadPropiedad = async () => {
    const loadingToast = toast.loading('Cargando propiedad...');
    
    try {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          titulo: data.titulo || '',
          tipo: data.tipo || '',
          precio: data.precio || '',
          ubicacion: data.ubicacion || '',
          descripcion: data.descripcion || '',
          habitaciones: data.habitaciones || '',
          banos: data.banos || '',
          metros2: data.metros2 || '',
          imagenes: data.imagenes || []
        });
        setImagePreviews(data.imagenes || []);
        
        toast.success('Propiedad cargada correctamente', {
          id: loadingToast,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error cargando propiedad:', error);
      toast.error('Error al cargar la propiedad', {
        id: loadingToast,
        description: error.message,
        duration: 4000,
      });
      router.push('/admin/propiedades');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validar cantidad máxima de imágenes
    if (imagePreviews.length + files.length > 10) {
      toast.warning('Máximo 10 imágenes permitidas', {
        description: `Ya tienes ${imagePreviews.length} imágenes. Puedes agregar ${10 - imagePreviews.length} más.`,
        duration: 4000,
      });
      return;
    }

    // Validar tamaño de cada archivo
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (let file of files) {
      if (file.size > maxSize) {
        toast.error('Imagen demasiado grande', {
          description: `${file.name} excede el tamaño máximo de 5MB`,
          duration: 4000,
        });
        return;
      }
    }

    const loadingToast = toast.loading(`Procesando ${files.length} imagen(es)...`);

    // Convertir todas las imágenes a base64
    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then(base64Images => {
        setImagePreviews(prev => [...prev, ...base64Images]);
        setFormData(prev => ({
          ...prev,
          imagenes: [...prev.imagenes, ...base64Images]
        }));
        
        toast.success(`${files.length} imagen(es) agregada(s)`, {
          id: loadingToast,
          duration: 2000,
        });
      })
      .catch(error => {
        console.error('Error procesando imágenes:', error);
        toast.error('Error al procesar las imágenes', {
          id: loadingToast,
          duration: 3000,
        });
      });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
    toast.success('Imagen eliminada', {
      duration: 2000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.titulo || !formData.tipo || !formData.precio || !formData.ubicacion) {
      toast.error('Campos incompletos', {
        description: 'Por favor completa todos los campos obligatorios marcados con *',
        duration: 4000,
      });
      return;
    }

    if (formData.imagenes.length === 0) {
      toast.error('Se requiere al menos una imagen', {
        description: 'Agrega al menos una imagen de la propiedad',
        duration: 4000,
      });
      return;
    }

    const loadingToast = toast.loading('Actualizando propiedad...');
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('propiedades')
        .update({
          titulo: formData.titulo,
          tipo: formData.tipo,
          precio: parseFloat(formData.precio),
          ubicacion: formData.ubicacion,
          descripcion: formData.descripcion || null,
          habitaciones: parseInt(formData.habitaciones) || null,
          banos: parseInt(formData.banos) || null,
          metros2: parseInt(formData.metros2) || null,
          imagenes: formData.imagenes
        })
        .eq('id', id)
        .select();

      if (error) throw error;

      toast.success('¡Propiedad actualizada exitosamente!', {
        id: loadingToast,
        description: 'Redirigiendo al listado...',
        duration: 3000,
      });

      setTimeout(() => {
        router.push('/admin/propiedades');
      }, 1500);
    } catch (error) {
      console.error('Error actualizando propiedad:', error);
      toast.error('Error al actualizar la propiedad', {
        id: loadingToast,
        description: error.message,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cerro-verde" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/admin/propiedades">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-granito" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-xela-navy">Editar Propiedad</h1>
          <p className="text-granito mt-1">Modifica los campos que desees actualizar</p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* IMÁGENES */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-xela-navy mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Imágenes de la Propiedad
            <span className="text-sm font-normal text-granito ml-2">
              ({imagePreviews.length}/10)
            </span>
          </h2>

          <div className="space-y-4">
            {/* PREVIEWS GRID */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-cerro-verde text-white text-xs font-bold rounded">
                        Principal
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* UPLOAD BUTTON */}
            {imagePreviews.length < 10 && (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-niebla rounded-lg cursor-pointer hover:border-cerro-verde transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-granito mb-3" />
                  <p className="mb-2 text-sm text-granito">
                    <span className="font-semibold">Click para subir</span> o arrastra y suelta
                  </p>
                  <p className="text-xs text-granito">
                    PNG, JPG, JPEG (MAX. 5MB por imagen)
                  </p>
                  <p className="text-xs text-cerro-verde font-semibold mt-2">
                    Puedes seleccionar múltiples imágenes
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </label>
            )}

            {imagePreviews.length === 0 && (
              <p className="text-sm text-granito text-center">
                La primera imagen será la imagen principal de la propiedad
              </p>
            )}
          </div>
        </div>

        {/* INFORMACIÓN BÁSICA */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-xela-navy mb-4 flex items-center gap-2">
            <Home className="w-5 h-5" />
            Información Básica
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* TÍTULO */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-granito mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej: Casa moderna en zona 10"
                className="w-full px-4 py-3 border border-niebla rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde"
                required
              />
            </div>

            {/* TIPO */}
            <div>
              <label className="block text-sm font-medium text-granito mb-2">
                Tipo de Propiedad <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-5 h-5 text-granito" />
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-niebla rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde appearance-none bg-white"
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Terreno">Terreno</option>
                </select>
              </div>
            </div>

            {/* PRECIO */}
            <div>
              <label className="block text-sm font-medium text-granito mb-2">
                Precio (Q) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-granito" />
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="1500000"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-niebla rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde"
                  required
                />
              </div>
            </div>

            {/* UBICACIÓN */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-granito mb-2">
                Ubicación <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-granito" />
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  placeholder="Zona 10, Ciudad de Guatemala"
                  className="w-full pl-10 pr-4 py-3 border border-niebla rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde"
                  required
                />
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-granito mb-2">
                Descripción
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-granito" />
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe las características principales de la propiedad..."
                  rows="4"
                  className="w-full pl-10 pr-4 py-3 border border-niebla rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CARACTERÍSTICAS */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-xela-navy mb-4">Características</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* HABITACIONES */}
            <div>
              <label className="block text-sm font-medium text-granito mb-2">
                Habitaciones
              </label>
              <div className="relative">
                <Bed className="absolute left-3 top-3 w-5 h-5 text-granito" />
                <input
                  type="number"
                  name="habitaciones"
                  value={formData.habitaciones}
                  onChange={handleChange}
                  placeholder="3"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-niebla rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde"
                />
              </div>
            </div>

            {/* BAÑOS */}
            <div>
              <label className="block text-sm font-medium text-granito mb-2">
                Baños
              </label>
              <div className="relative">
                <Bath className="absolute left-3 top-3 w-5 h-5 text-granito" />
                <input
                  type="number"
                  name="banos"
                  value={formData.banos}
                  onChange={handleChange}
                  placeholder="2"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-niebla rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde"
                />
              </div>
            </div>

            {/* METROS² */}
            <div>
              <label className="block text-sm font-medium text-granito mb-2">
                Metros²
              </label>
              <div className="relative">
                <Maximize className="absolute left-3 top-3 w-5 h-5 text-granito" />
                <input
                  type="number"
                  name="metros2"
                  value={formData.metros2}
                  onChange={handleChange}
                  placeholder="150"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-niebla rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 justify-end">
          <Link href="/admin/propiedades">
            <button
              type="button"
              className="px-6 py-3 border border-niebla rounded-lg font-medium text-granito hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-cerro-verde hover:bg-xela-navy text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Actualizando...</span>
              </>
            ) : (
              <>
                <Home className="w-5 h-5" />
                <span>Actualizar Propiedad</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}