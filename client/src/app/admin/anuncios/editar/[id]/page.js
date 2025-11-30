'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft,
  Upload,
  X,
  Loader2,
  Newspaper,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Save
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export default function EditarAnuncioPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: null,
    activo: true
  });

  useEffect(() => {
    loadAnuncio();
  }, [id]);

  const showAlert = (type, message, description = '') => {
    setAlert({ type, message, description });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadAnuncio = async () => {
    try {
      setLoadingData(true);
      const { data, error } = await supabase
        .from('anuncios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        showAlert('error', 'Anuncio no encontrado');
        setTimeout(() => router.push('/admin/anuncios'), 2000);
        return;
      }

      setFormData({
        titulo: data.titulo || '',
        descripcion: data.descripcion || '',
        imagen: data.imagen || null,
        activo: data.activo ?? true
      });

      if (data.imagen) {
        setImagePreview(data.imagen);
      }

      showAlert('success', 'Anuncio cargado correctamente');
    } catch (error) {
      console.error('Error cargando anuncio:', error);
      showAlert('error', 'Error al cargar el anuncio', error.message);
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

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      activo: checked
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      showAlert('error', 'Archivo no válido', 'Por favor selecciona una imagen (JPG, PNG, JPEG)');
      return;
    }

    // Validar tamaño (máx 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showAlert('error', 'Imagen demasiado grande', 'El tamaño máximo permitido es 5MB');
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData(prev => ({
        ...prev,
        imagen: reader.result
      }));
      showAlert('success', 'Imagen cargada correctamente');
    };
    reader.onerror = () => {
      showAlert('error', 'Error al cargar la imagen', 'Intenta de nuevo');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      imagen: null
    }));
    showAlert('success', 'Imagen eliminada');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.titulo.trim()) {
      showAlert('error', 'Título requerido', 'Por favor ingresa un título para el anuncio');
      return;
    }

    if (!formData.imagen) {
      showAlert('error', 'Imagen requerida', 'Por favor sube una imagen del proyecto');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('anuncios')
        .update({
          titulo: formData.titulo.trim(),
          descripcion: formData.descripcion.trim() || null,
          imagen: formData.imagen,
          activo: formData.activo,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;

      showAlert('success', '¡Anuncio actualizado exitosamente!', 'Redirigiendo al listado...');

      setTimeout(() => {
        router.push('/admin/anuncios');
      }, 1500);
    } catch (error) {
      console.error('Error actualizando anuncio:', error);
      showAlert('error', 'Error al actualizar el anuncio', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-16 h-16 animate-spin text-naranja mb-4" />
        <p className="text-gris-oscuro text-lg font-semibold">Cargando anuncio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/admin/anuncios">
          <Button variant="outline" size="icon" className="border-2 border-gris-medio hover:border-naranja hover:bg-naranja/10 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gris-oscuro flex items-center gap-3">
            <Newspaper className="w-9 h-9 text-naranja" />
            Editar Anuncio
          </h1>
          <p className="text-gris-oscuro/70 mt-2 text-lg">
            Modifica la información del anuncio
          </p>
        </div>
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

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* IMAGEN */}
        <Card className="border-2 border-gris-medio">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gris-oscuro flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-naranja" />
              Imagen del Proyecto
              <Badge className="bg-rojo-naranja/10 text-rojo-naranja border border-rojo-naranja/30 ml-2">
                Requerida
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* PREVIEW */}
            {imagePreview ? (
              <div className="relative group">
                <div className="relative w-full h-96 rounded-xl overflow-hidden border-2 border-gris-medio group-hover:border-naranja transition-all">
                  <Image 
                    src={imagePreview} 
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 text-blanco rounded-full transition-all shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <X className="w-5 h-5" />
                </button>
                <Badge className="absolute bottom-4 left-4 bg-gradient-cta text-blanco font-bold shadow-naranja text-sm py-2 px-4">
                  Imagen Principal
                </Badge>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-gris-medio rounded-xl cursor-pointer hover:border-naranja hover:bg-naranja/5 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-20 h-20 bg-naranja/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-naranja/20 transition-all">
                    <Upload className="w-10 h-10 text-naranja" />
                  </div>
                  <p className="mb-3 text-lg text-gris-oscuro font-bold">
                    Click para subir o arrastra y suelta
                  </p>
                  <p className="text-sm text-gris-oscuro/70 mb-2">
                    Formatos: PNG, JPG, JPEG
                  </p>
                  <p className="text-sm text-gris-oscuro/70">
                    Tamaño máximo: 5MB
                  </p>
                  <Badge className="mt-4 bg-naranja/10 text-naranja border border-naranja/30">
                    Recomendado: 1920x1080px
                  </Badge>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}

            <p className="text-sm text-gris-oscuro/70 text-center py-2 bg-amarillo-dorado/10 rounded-lg border border-amarillo-dorado/20">
              💡 <span className="font-semibold">Tip:</span> Usa imágenes horizontales de alta calidad para mejores resultados
            </p>
          </CardContent>
        </Card>

        {/* INFORMACIÓN */}
        <Card className="border-2 border-gris-medio">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gris-oscuro flex items-center gap-3">
              <FileText className="w-6 h-6 text-naranja" />
              Información del Anuncio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            
            {/* TÍTULO */}
            <div>
              <Label htmlFor="titulo" className="text-gris-oscuro font-semibold mb-2 flex items-center gap-2">
                Título del Proyecto
                <span className="text-rojo-naranja">*</span>
              </Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej: Avance Proyecto Residencial Las Flores"
                required
                maxLength={100}
                className="border-2 border-gris-medio focus:border-naranja h-12 rounded-xl"
              />
              <p className="text-xs text-gris-oscuro/70 mt-2">
                {formData.titulo.length}/100 caracteres
              </p>
            </div>

            {/* DESCRIPCIÓN */}
            <div>
              <Label htmlFor="descripcion" className="text-gris-oscuro font-semibold mb-2">
                Descripción (Opcional)
              </Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Agrega detalles sobre el avance o características del proyecto..."
                rows={5}
                maxLength={500}
                className="border-2 border-gris-medio focus:border-naranja rounded-xl resize-none"
              />
              <p className="text-xs text-gris-oscuro/70 mt-2">
                {formData.descripcion.length}/500 caracteres
              </p>
            </div>

            {/* ESTADO */}
            <div className={`${
              formData.activo 
                ? 'bg-gradient-to-r from-green-50 to-green-100/50 border-green-200' 
                : 'bg-gradient-to-r from-red-50 to-red-100/50 border-red-200'
            } border-2 rounded-xl p-5`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    formData.activo ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {formData.activo ? (
                      <CheckCircle className="w-6 h-6 text-blanco" />
                    ) : (
                      <X className="w-6 h-6 text-blanco" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gris-oscuro text-lg">
                      Estado del Anuncio
                    </h4>
                    <p className="text-sm text-gris-oscuro/70">
                      {formData.activo 
                        ? 'El anuncio está visible públicamente' 
                        : 'El anuncio está oculto'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.activo}
                  onCheckedChange={handleSwitchChange}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PREVIEW CARD */}
        <Card className="border-2 border-naranja/50 bg-gradient-to-br from-naranja/5 to-amarillo-dorado/5">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gris-oscuro flex items-center gap-3">
              <Newspaper className="w-6 h-6 text-naranja" />
              Vista Previa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blanco rounded-xl border-2 border-gris-medio overflow-hidden">
              {/* Preview Image */}
              <div className="relative h-48 bg-gris-medio">
                {imagePreview ? (
                  <Image 
                    src={imagePreview} 
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gris-oscuro/30" />
                  </div>
                )}
                <Badge className={`absolute top-3 right-3 font-bold ${
                  formData.activo 
                    ? 'bg-green-500 text-blanco' 
                    : 'bg-red-500 text-blanco'
                }`}>
                  {formData.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              
              {/* Preview Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gris-oscuro mb-2">
                  {formData.titulo || 'Título del anuncio'}
                </h3>
                {formData.descripcion && (
                  <p className="text-sm text-gris-oscuro/70">
                    {formData.descripcion}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <div className="flex gap-4 justify-end">
          <Link href="/admin/anuncios">
            <Button
              type="button"
              variant="outline"
              className="border-2 border-gris-medio hover:bg-gris-claro rounded-xl font-bold px-8 py-6 text-base"
            >
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="btn-cta px-8 py-6 rounded-xl font-bold text-base shadow-naranja"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}