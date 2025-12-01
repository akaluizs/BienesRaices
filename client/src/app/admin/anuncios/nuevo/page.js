'use client';

import { useState } from 'react';
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
  Video,
  Link as LinkIcon,
  Youtube,
  HardDrive
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NuevoAnuncioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [alert, setAlert] = useState(null);
  const [mediaType, setMediaType] = useState('imagen'); // 'imagen' o 'video'
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: null,
    video_url: '',
    activo: true
  });

  const showAlert = (type, message, description = '') => {
    setAlert({ type, message, description });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaTypeChange = (type) => {
    setMediaType(type);
    // Limpiar el otro tipo de media
    if (type === 'imagen') {
      setFormData(prev => ({ ...prev, video_url: '' }));
    } else {
      setFormData(prev => ({ ...prev, imagen: null }));
      setImagePreview(null);
    }
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
        imagen: reader.result,
        video_url: '' // Limpiar video si hay imagen
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

  // Extraer ID de YouTube
  const extractYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Extraer ID de Google Drive
  const extractDriveId = (url) => {
    // Formatos soportados:
    // https://drive.google.com/file/d/FILE_ID/view
    // https://drive.google.com/open?id=FILE_ID
    const regex = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Detectar tipo de video
  const detectVideoType = (url) => {
    if (extractYouTubeId(url)) return 'youtube';
    if (extractDriveId(url)) return 'drive';
    return null;
  };

  // Obtener embed URL según el tipo
  const getEmbedUrl = (url) => {
    const videoType = detectVideoType(url);
    
    if (videoType === 'youtube') {
      const videoId = extractYouTubeId(url);
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (videoType === 'drive') {
      const fileId = extractDriveId(url);
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.titulo.trim()) {
      showAlert('error', 'Título requerido', 'Por favor ingresa un título para el anuncio');
      return;
    }

    if (mediaType === 'imagen' && !formData.imagen) {
      showAlert('error', 'Imagen requerida', 'Por favor sube una imagen del proyecto');
      return;
    }

    if (mediaType === 'video' && !formData.video_url.trim()) {
      showAlert('error', 'URL de video requerida', 'Por favor ingresa el enlace del video');
      return;
    }

    if (mediaType === 'video') {
      const videoType = detectVideoType(formData.video_url);
      if (!videoType) {
        showAlert('error', 'URL inválida', 'Por favor ingresa un enlace válido de YouTube o Google Drive');
        return;
      }
    }

    setLoading(true);

    try {
      // Obtener el orden máximo actual
      const { data: maxOrdenData } = await supabase
        .from('anuncios')
        .select('orden')
        .order('orden', { ascending: false })
        .limit(1);

      const nuevoOrden = maxOrdenData && maxOrdenData.length > 0 
        ? maxOrdenData[0].orden + 1 
        : 0;

      const { data, error } = await supabase
        .from('anuncios')
        .insert([{
          titulo: formData.titulo.trim(),
          descripcion: formData.descripcion.trim() || null,
          imagen: mediaType === 'imagen' ? formData.imagen : null,
          video_url: mediaType === 'video' ? formData.video_url.trim() : null,
          activo: formData.activo,
          orden: nuevoOrden
        }])
        .select();

      if (error) throw error;

      showAlert('success', '¡Anuncio creado exitosamente!', 'Redirigiendo al listado...');

      setTimeout(() => {
        router.push('/admin/anuncios');
      }, 1500);
    } catch (error) {
      console.error('Error creando anuncio:', error);
      showAlert('error', 'Error al crear el anuncio', error.message);
    } finally {
      setLoading(false);
    }
  };

  const embedUrl = formData.video_url ? getEmbedUrl(formData.video_url) : null;
  const videoType = formData.video_url ? detectVideoType(formData.video_url) : null;

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
            Nuevo Anuncio
          </h1>
          <p className="text-gris-oscuro/70 mt-2 text-lg">
            Crea un anuncio de avance o nuevo proyecto
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
        
        {/* MEDIA (IMAGEN O VIDEO) */}
        <Card className="border-2 border-gris-medio">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gris-oscuro flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-naranja" />
              Contenido del Anuncio
              <Badge className="bg-rojo-naranja/10 text-rojo-naranja border border-rojo-naranja/30 ml-2">
                Requerido
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* TABS IMAGEN/VIDEO */}
            <Tabs value={mediaType} onValueChange={handleMediaTypeChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="imagen" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Imagen
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video
                </TabsTrigger>
              </TabsList>

              {/* TAB IMAGEN */}
              <TabsContent value="imagen" className="space-y-4">
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
              </TabsContent>

              {/* TAB VIDEO */}
              <TabsContent value="video" className="space-y-4">
                <div>
                  <Label htmlFor="video_url" className="text-gris-oscuro font-semibold mb-2 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-naranja" />
                    URL del Video
                  </Label>
                  <Input
                    id="video_url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleChange}
                    placeholder="Pega aquí el enlace de YouTube o Google Drive..."
                    className="border-2 border-gris-medio focus:border-naranja h-12 rounded-xl"
                  />
                  
                  {/* EJEMPLOS */}
                  <div className="mt-3 p-4 bg-gris-claro rounded-lg space-y-2">
                    <p className="text-xs font-semibold text-gris-oscuro mb-2">📌 Formatos aceptados:</p>
                    
                    <div className="flex items-start gap-2">
                      <Youtube className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gris-oscuro">YouTube:</p>
                        <code className="text-xs text-gris-oscuro/70 break-all">
                          https://www.youtube.com/watch?v=...
                        </code>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <HardDrive className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gris-oscuro">Google Drive:</p>
                        <code className="text-xs text-gris-oscuro/70 break-all">
                          https://drive.google.com/file/d/.../view
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* DETECTOR DE TIPO */}
                  {formData.video_url && videoType && (
                    <div className="mt-3">
                      <Badge className={`${
                        videoType === 'youtube' ? 'bg-red-100 text-red-700 border-red-300' :
                        'bg-blue-100 text-blue-700 border-blue-300'
                      } border-2`}>
                        {videoType === 'youtube' ? (
                          <>
                            <Youtube className="w-3 h-3 mr-1" />
                            Video de YouTube detectado
                          </>
                        ) : (
                          <>
                            <HardDrive className="w-3 h-3 mr-1" />
                            Video de Google Drive detectado
                          </>
                        )}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* PREVIEW VIDEO */}
                {embedUrl && (
                  <div className="relative w-full rounded-xl overflow-hidden border-2 border-naranja bg-gris-oscuro">
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={embedUrl}
                        title="Video preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <Badge className="absolute bottom-4 left-4 bg-gradient-cta text-blanco font-bold shadow-naranja text-sm py-2 px-4">
                      <Video className="w-4 h-4 mr-1" />
                      Video Principal
                    </Badge>
                  </div>
                )}

                {formData.video_url && !videoType && (
                  <Alert className="border-2 bg-yellow-50 border-yellow-500">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <AlertDescription className="font-semibold ml-2 text-yellow-800">
                      <div className="font-bold mb-1">URL no reconocida</div>
                      <div className="text-sm font-normal">
                        Asegúrate de usar un enlace de YouTube o Google Drive válido
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
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

            {/* ESTADO INICIAL */}
            <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-2 border-green-200 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blanco" />
                </div>
                <div>
                  <h4 className="font-bold text-gris-oscuro text-lg">Publicación Automática</h4>
                  <p className="text-sm text-gris-oscuro/70">
                    El anuncio se publicará inmediatamente al crearlo
                  </p>
                </div>
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
              {/* Preview Media */}
              <div className="relative bg-gris-medio">
                {mediaType === 'imagen' && imagePreview ? (
                  <div className="relative h-64">
                    <Image 
                      src={imagePreview} 
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : mediaType === 'video' && embedUrl ? (
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={embedUrl}
                      title="Video preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center">
                    {mediaType === 'imagen' ? (
                      <ImageIcon className="w-16 h-16 text-gris-oscuro/30" />
                    ) : (
                      <Video className="w-16 h-16 text-gris-oscuro/30" />
                    )}
                  </div>
                )}
                <Badge className="absolute top-3 right-3 bg-green-500 text-blanco font-bold">
                  Activo
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
                Creando...
              </>
            ) : (
              <>
                <Newspaper className="w-5 h-5 mr-2" />
                Crear Anuncio
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}