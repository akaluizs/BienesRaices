'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useImageUpload } from '@/hooks/useImageUpload';
import Image from 'next/image';
import {
  Plus,
  Loader2,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  ImageIcon,
  Link as LinkIcon,
  Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function NuevoAnuncioPage() {
  const router = useRouter();
  const { processImage, uploading, progress } = useImageUpload();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: null,
    imagenUrl: '',
    video_url: '',
  });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // Crear slug seguro del título
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        imagen: file,
        imagenUrl: event.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remover imagen
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imagen: null,
      imagenUrl: '',
    }));
  };

  // Guardar anuncio
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      showAlert('error', 'El título es obligatorio');
      return;
    }

    if (!formData.imagen && !formData.video_url) {
      showAlert('error', 'Debes agregar una imagen o video');
      return;
    }

    setLoading(true);
    try {
      let imagenUrl = '';

      // Subir imagen a R2 si existe
      if (formData.imagen) {
        setUploadStatus('Optimizando imagen...');
        const slug = createSlug(formData.titulo);
        
        const result = await processImage(
          formData.imagen,
          'anuncios',
          slug,
          (msg) => setUploadStatus(msg)
        );
        
        imagenUrl = result.url;
      }

      setUploadStatus('Guardando anuncio en base de datos...');

      // Insertar en base de datos
      const { data, error } = await supabase
        .from('anuncios')
        .insert([
          {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            imagen: imagenUrl,
            video_url: formData.video_url,
            activo: true,
            orden: 0,
          },
        ])
        .select();

      if (error) throw error;

      showAlert('success', 'Anuncio creado exitosamente');
      setUploadStatus('');
      setTimeout(() => {
        router.push('/admin/anuncios');
      }, 2000);
    } catch (error) {
      console.error('Error creando anuncio:', error);
      showAlert('error', error.message || 'Error al crear el anuncio');
      setUploadStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gris-oscuro flex items-center gap-3">
          <Plus className="w-9 h-9 text-naranja" />
          Nuevo Anuncio
        </h1>
        <p className="text-gris-oscuro/70 mt-2">Crea un nuevo anuncio de proyecto</p>
      </div>

      {/* ALERT */}
      {alert && (
        <Alert className={`border-2 ${
          alert.type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
        }`}>
          {alert.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <AlertDescription className={`font-semibold ml-2 ${
            alert.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      {/* UPLOAD STATUS */}
      {(uploading || uploadStatus) && (
        <Card className="bg-blue-50 border-2 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <div className="flex-1">
                <p className="font-bold text-blue-900 mb-2">{uploadStatus}</p>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-blue-700 mt-1">{progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* TÍTULO */}
        <Card className="border-2 border-gris-medio">
          <CardContent className="p-6">
            <label className="block mb-3">
              <p className="text-sm font-bold text-gris-oscuro mb-2">Título del Anuncio *</p>
              <Input
                type="text"
                placeholder="Ej: Nuevo Proyecto Residencial en Zona 10"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                className="border-2 border-gris-medio focus:border-naranja py-6 text-base rounded-xl"
              />
              <p className="text-xs text-gris-oscuro/70 mt-2">
                💡 Se creará una carpeta en R2: <span className="font-bold text-naranja">/anuncios/{createSlug(formData.titulo)}/</span>
              </p>
            </label>
          </CardContent>
        </Card>

        {/* DESCRIPCIÓN */}
        <Card className="border-2 border-gris-medio">
          <CardContent className="p-6">
            <label className="block mb-3">
              <p className="text-sm font-bold text-gris-oscuro mb-2">Descripción</p>
              <textarea
                placeholder="Describe los detalles del anuncio..."
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full border-2 border-gris-medio focus:border-naranja rounded-xl p-4 text-base resize-none"
                rows="5"
              />
            </label>
          </CardContent>
        </Card>

        {/* IMAGEN */}
        <Card className="border-2 border-gris-medio">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-gris-oscuro mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-naranja" />
              Imagen del Anuncio
            </p>
            
            {!formData.imagenUrl ? (
              <label className="block border-2 border-dashed border-gris-medio rounded-xl p-8 text-center cursor-pointer hover:border-naranja hover:bg-naranja/5 transition-all">
                <Upload className="w-12 h-12 text-gris-oscuro/50 mx-auto mb-3" />
                <p className="font-bold text-gris-oscuro mb-1">Sube una imagen</p>
                <p className="text-sm text-gris-oscuro/70">JPG, PNG</p>
                <p className="text-xs text-gris-oscuro/60 mt-2 flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Se optimizará a WebP automáticamente
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src={formData.imagenUrl}
                  alt="Preview"
                  width={800}
                  height={450}
                  className="w-full h-64 object-cover"
                />
                <Button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-blanco rounded-full p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* VIDEO URL */}
        <Card className="border-2 border-gris-medio">
          <CardContent className="p-6">
            <label className="block mb-3">
              <p className="text-sm font-bold text-gris-oscuro mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-naranja" />
                URL de Video (YouTube o Google Drive)
              </p>
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=... o link de Drive"
                value={formData.video_url}
                onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                className="border-2 border-gris-medio focus:border-naranja py-6 text-base rounded-xl"
              />
              <p className="text-xs text-gris-oscuro/70 mt-2">
                ℹ️ Si pones imagen, el video será ignorado en la vista previa
              </p>
            </label>
          </CardContent>
        </Card>

        {/* BOTONES */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1 border-2 border-gris-medio hover:bg-gris-claro rounded-xl font-bold py-6"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 btn-cta rounded-xl font-bold py-6 shadow-naranja disabled:opacity-50"
          >
            {loading || uploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Crear Anuncio
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}