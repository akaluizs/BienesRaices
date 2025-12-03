'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useImageUpload } from '@/hooks/useImageUpload';
import { updateProperty, getProperty } from '@/lib/actions/propertyActions';
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
  Building2,
  CheckCircle,
  AlertCircle,
  Zap,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

export default function EditarPropiedadPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { processImage, uploading, progress } = useImageUpload();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [alert, setAlert] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [propiedadActual, setPropiedadActual] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    precio: '',
    ubicacion: '',
    descripcion: '',
    habitaciones: '',
    banos: '',
    metros2: '',
    VentaPreventa: 'Venta',
    codigo: '',
    imagenes: [],
    headerImageIndex: 0, 
    headerImage: '', 
  });

  useEffect(() => {
    loadPropiedad();
  }, [id]);

  const showAlert = (type, message, description = '') => {
    setAlert({ type, message, description });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadPropiedad = async () => {
    try {
      const result = await getProperty(id);

      if (!result.success) {
        throw new Error(result.error);
      }

      const data = result.data;

      if (data) {
        setPropiedadActual(data);

        let headerIndex = 0;
        if (data.header_image && Array.isArray(data.imagenes)) {
          headerIndex = data.imagenes.findIndex(img => img === data.header_image);
          if (headerIndex === -1) headerIndex = 0; 
        }

        setFormData({
          titulo: data.titulo || '',
          tipo: data.tipo || '',
          precio: data.precio || '',
          ubicacion: data.ubicacion || '',
          descripcion: data.descripcion || '',
          habitaciones: data.habitaciones || '',
          banos: data.banos || '',
          metros2: data.metros2 || '',
          VentaPreventa: data.VentaPreventa || 'Venta',
          codigo: data.codigo || '',
          imagenes: data.imagenes || [],
          headerImageIndex: headerIndex,
          headerImage: data.header_image || '',
        });
        setImagePreviews(data.imagenes || []);
        showAlert('success', 'Propiedad cargada correctamente');
      }
    } catch (error) {
      console.error('Error cargando propiedad:', error);
      showAlert('error', 'Error al cargar la propiedad', error.message);
      setTimeout(() => router.push('/admin/propiedades'), 2000);
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

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      tipo: value
    }));
  };

  const handleVentaPreventa = (value) => {
    setFormData(prev => ({
      ...prev,
      VentaPreventa: value
    }));
  };

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // ✅ Establecer imagen como principal
  const setHeaderImage = (index) => {
    setFormData(prev => ({
      ...prev,
      headerImageIndex: index,
      headerImage: prev.imagenes[index] || '',
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    if (imagePreviews.length + files.length > 10) {
      showAlert('warning', 'Máximo 10 imágenes permitidas', 
        `Ya tienes ${imagePreviews.length} imágenes. Puedes agregar ${10 - imagePreviews.length} más.`);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    for (let file of files) {
      if (file.size > maxSize) {
        showAlert('error', 'Imagen demasiado grande', 
          `${file.name} excede el tamaño máximo de 5MB`);
        return;
      }
    }

    // Procesar imágenes
    let processedCount = 0;
    const newImageUrls = [];

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Agregar preview temporal
        setImagePreviews(prev => [...prev, reader.result]);

        // Procesar y subir a R2
        try {
          const slug = createSlug(formData.titulo);
          setUploadStatus(`Optimizando imagen ${index + 1}/${files.length}...`);

          const result = await processImage(
            file,
            'propiedades',
            slug,
            (msg) => setUploadStatus(msg)
          );

          newImageUrls.push(result.url);
          processedCount++;

          // Si terminamos de procesar todas
          if (processedCount === files.length) {
            const todasLasImagenes = [...formData.imagenes, ...newImageUrls];
            setFormData(prev => ({
              ...prev,
              imagenes: todasLasImagenes
            }));
            setUploadStatus('');
            showAlert('success', `${files.length} imagen(es) agregada(s) y optimizada(s)`);
          }
        } catch (error) {
          console.error('Error procesando imagen:', error);
          showAlert('error', 'Error optimizando imagen', error.message);
          setUploadStatus('');
          // Remover preview si falló
          setImagePreviews(prev => prev.filter((_, i) => i !== prev.length - 1));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = async (index) => {
    const imageUrl = imagePreviews[index];

    // Si es una URL de R2, eliminar de R2
    if (imageUrl && imageUrl.startsWith('https://')) {
      try {
        await fetch('/api/r2/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileUrl: imageUrl }),
        });
      } catch (error) {
        console.warn('⚠️ No se pudo eliminar imagen de R2:', error);
      }
    }

    let nuevoIndice = formData.headerImageIndex;
    if (nuevoIndice === index) {
      nuevoIndice = Math.max(0, index - 1);
    } else if (nuevoIndice > index) {
      nuevoIndice--;
    }

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    const nuevasImagenes = formData.imagenes.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      imagenes: nuevasImagenes,
      headerImageIndex: nuevoIndice,
      headerImage: nuevasImagenes[nuevoIndice] || '',
    }));
    
    showAlert('success', 'Imagen eliminada');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.tipo || !formData.precio || !formData.ubicacion) {
      showAlert('error', 'Campos incompletos', 
        'Por favor completa todos los campos obligatorios marcados con *');
      return;
    }

    if (formData.imagenes.length === 0) {
      showAlert('error', 'Se requiere al menos una imagen', 
        'Agrega al menos una imagen de la propiedad');
      return;
    }

    setLoading(true);

    try {
      setUploadStatus('Actualizando propiedad en base de datos...');

      // ✅ Preparar datos para actualizar
      const propertyData = {
        titulo: formData.titulo,
        tipo: formData.tipo,
        precio: parseFloat(formData.precio),
        ubicacion: formData.ubicacion,
        descripcion: formData.descripcion || null,
        habitaciones: parseInt(formData.habitaciones) || null,
        banos: parseInt(formData.banos) || null,
        metros2: parseInt(formData.metros2) || null,
        VentaPreventa: formData.VentaPreventa || 'Venta',
        codigo: formData.codigo || null,
        imagenes: formData.imagenes,
        header_image: formData.imagenes[formData.headerImageIndex] || formData.imagenes[0],
      };

      // ✅ Usar Server Action con revalidación automática
      const result = await updateProperty(id, propertyData);

      if (!result.success) {
        throw new Error(result.error);
      }

      setUploadStatus('');
      showAlert('success', result.message || 'Propiedad actualizada exitosamente', 
        'Redirigiendo al listado...');

      setTimeout(() => {
        router.push('/admin/propiedades');
        router.refresh(); // Forzar refresh para ver los cambios inmediatamente
      }, 1500);
    } catch (error) {
      console.error('Error actualizando propiedad:', error);
      showAlert('error', 'Error al actualizar la propiedad', error.message);
      setUploadStatus('');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-16 h-16 animate-spin text-naranja mb-4" />
        <p className="text-gris-oscuro text-lg font-semibold">Cargando propiedad...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/admin/propiedades">
          <Button variant="outline" size="icon" className="border-2 border-gris-medio hover:border-naranja hover:bg-naranja/10 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gris-oscuro flex items-center gap-3">
            <Home className="w-9 h-9 text-naranja" />
            Editar Propiedad
          </h1>
          <p className="text-gris-oscuro/70 mt-2 text-lg">
            Modifica los campos que desees actualizar
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

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* IMÁGENES */}
        <Card className="border-2 border-gris-medio">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gris-oscuro flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-naranja" />
              Imágenes de la Propiedad
              <Badge className="bg-naranja/10 text-naranja border border-naranja/30 ml-2">
                {imagePreviews.length}/10
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* ✅ INFO SOBRE IMAGEN PRINCIPAL */}
            {imagePreviews.length > 0 && (
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <p className="text-xs font-bold text-blue-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Haz clic en una imagen para establecerla como imagen principal
                </p>
              </div>
            )}

            {/* PREVIEWS GRID */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div 
                    key={index} 
                    className={`relative group rounded-xl overflow-hidden cursor-pointer transition-all ${
                      formData.headerImageIndex === index ? 'ring-4 ring-naranja scale-95' : ''
                    }`}
                    onClick={() => setHeaderImage(index)}
                  >
                    {preview.startsWith('data:') ? (
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover border-2 border-gris-medio group-hover:border-naranja transition-all"
                      />
                    ) : (
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover border-2 border-gris-medio group-hover:border-naranja transition-all"
                      />
                    )}
                    
                    {/* ✅ BADGE DE IMAGEN PRINCIPAL */}
                    {formData.headerImageIndex === index && (
                      <div className="absolute inset-0 bg-naranja/20 flex items-center justify-center">
                        <Star className="w-8 h-8 text-naranja fill-naranja" />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-blanco rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* UPLOAD BUTTON */}
            {imagePreviews.length < 10 && (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gris-medio rounded-xl cursor-pointer hover:border-naranja hover:bg-naranja/5 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-16 h-16 bg-naranja/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-naranja/20 transition-all">
                    <Upload className="w-8 h-8 text-naranja" />
                  </div>
                  <p className="mb-2 text-sm text-gris-oscuro font-semibold">
                    Click para subir o arrastra y suelta
                  </p>
                  <p className="text-xs text-gris-oscuro/70">
                    PNG, JPG, JPEG (MAX. 5MB por imagen)
                  </p>
                  <p className="text-xs text-naranja font-bold mt-2 flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3" />
                    Se optimizarán a WebP automáticamente
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={uploading}
                />
              </label>
            )}

            {imagePreviews.length === 0 && (
              <p className="text-sm text-gris-oscuro/70 text-center py-2">
                💡 La primera imagen será la imagen principal de la propiedad
              </p>
            )}
          </CardContent>
        </Card>

        {/* INFORMACIÓN BÁSICA */}
        <Card className="border-2 border-gris-medio">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gris-oscuro flex items-center gap-3">
              <Home className="w-6 h-6 text-naranja" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            
            {/* TÍTULO */}
            <div>
              <Label htmlFor="titulo" className="text-gris-oscuro font-semibold mb-2">
                Título <span className="text-rojo-naranja">*</span>
              </Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej: Casa moderna en zona residencial"
                required
                className="border-2 border-gris-medio focus:border-naranja h-12 rounded-xl"
              />
              <p className="text-xs text-gris-oscuro/70 mt-2">
                💡 Carpeta en R2: <span className="font-bold text-naranja">/propiedades/{createSlug(formData.titulo)}/</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* TIPO */}
              <div>
                <Label htmlFor="tipo" className="text-gris-oscuro font-semibold mb-2">
                  Tipo de Propiedad <span className="text-rojo-naranja">*</span>
                </Label>
                <Select value={formData.tipo} onValueChange={handleSelectChange}>
                  <SelectTrigger className="border-2 border-gris-medio focus:border-naranja h-12 rounded-xl bg-blanco">
                    <Building2 className="w-5 h-5 text-naranja mr-2" />
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent 
                    className="!bg-blanco !opacity-100 border-2 border-gris-medio shadow-2xl"
                    style={{
                      backgroundColor: '#FFFFFF',
                      backdropFilter: 'none',
                      opacity: 1
                    }}
                  >
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                    <SelectItem value="Terreno">Terreno</SelectItem>
                    <SelectItem value="Local Comercial">Local Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* PRECIO */}
              <div>
                <Label htmlFor="precio" className="text-gris-oscuro font-semibold mb-2">
                  Precio (Q) <span className="text-rojo-naranja">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amarillo-dorado" />
                  <Input
                    id="precio"
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    placeholder="1500000"
                    step="0.01"
                    required
                    className="border-2 border-gris-medio focus:border-naranja h-12 rounded-xl pl-12"
                  />
                </div>
              </div>
            </div>

            {/* UBICACIÓN */}
            <div>
              <Label htmlFor="ubicacion" className="text-gris-oscuro font-semibold mb-2">
                Ubicación <span className="text-rojo-naranja">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naranja" />
                <Input
                  id="ubicacion"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  placeholder="Zona 1, Quetzaltenango"
                  required
                  className="border-2 border-gris-medio focus:border-naranja h-12 rounded-xl pl-12"
                />
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            <div>
              <Label htmlFor="descripcion" className="text-gris-oscuro font-semibold mb-2">
                Descripción
              </Label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-naranja" />
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe las características principales de la propiedad..."
                  rows={4}
                  className="border-2 border-gris-medio focus:border-naranja rounded-xl pl-12 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ESTADO Y CÓDIGO */}
        <Card className="border-2 border-gris-medio">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gris-oscuro flex items-center gap-3">
              <Building2 className="w-6 h-6 text-naranja" />
              Estado y Código
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* ESTADO DE VENTA */}
              <div>
                <Label htmlFor="VentaPreventa" className="text-gris-oscuro font-semibold mb-2">
                  Estado
                </Label>
                <Select value={formData.VentaPreventa} onValueChange={handleVentaPreventa}>
                  <SelectTrigger className="border-2 border-gris-medio focus:border-naranja h-12 rounded-xl bg-blanco">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="!bg-blanco border-2 border-gris-medio shadow-2xl">
                    <SelectItem value="Venta">💰 Venta</SelectItem>
                    <SelectItem value="Preventa">🔄 Preventa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CÓDIGO */}
              <div>
                <Label htmlFor="codigo" className="text-gris-oscuro font-semibold mb-2">
                  Código
                </Label>
                <Input
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  placeholder="Ej: PROP-001"
                  className="border-2 border-gris-medio focus:border-naranja h-12 rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CARACTERÍSTICAS */}
        <Card className="border-2 border-gris-medio">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gris-oscuro flex items-center gap-3">
              <Maximize className="w-6 h-6 text-naranja" />
              Características
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* HABITACIONES */}
              <div>
                <Label htmlFor="habitaciones" className="text-gris-oscuro font-semibold mb-2">
                  Habitaciones
                </Label>
                <div className="relative">
                  <Bed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naranja" />
                  <Input
                    id="habitaciones"
                    type="number"
                    name="habitaciones"
                    value={formData.habitaciones}
                    onChange={handleChange}
                    placeholder="3"
                    min="0"
                    className="border-2 border-gris-medio focus:border-naranja h-12 rounded-xl pl-12"
                  />
                </div>
              </div>

              {/* BAÑOS */}
              <div>
                <Label htmlFor="banos" className="text-gris-oscuro font-semibold mb-2">
                  Baños
                </Label>
                <div className="relative">
                  <Bath className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naranja" />
                  <Input
                    id="banos"
                    type="number"
                    name="banos"
                    value={formData.banos}
                    onChange={handleChange}
                    placeholder="2"
                    min="0"
                    className="border-2 border-gris-medio focus:border-naranja h-12 rounded-xl pl-12"
                  />
                </div>
              </div>

              {/* METROS² */}
              <div>
                <Label htmlFor="metros2" className="text-gris-oscuro font-semibold mb-2">
                  Metros²
                </Label>
                <div className="relative">
                  <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naranja" />
                  <Input
                    id="metros2"
                    type="number"
                    name="metros2"
                    value={formData.metros2}
                    onChange={handleChange}
                    placeholder="150"
                    min="0"
                    className="border-2 border-gris-medio focus:border-naranja h-12 rounded-xl pl-12"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <div className="flex gap-4 justify-end">
          <Link href="/admin/propiedades">
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
            disabled={loading || uploading}
            className="btn-cta px-8 py-6 rounded-xl font-bold text-base shadow-naranja disabled:opacity-50"
          >
            {loading || uploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Home className="w-5 h-5 mr-2" />
                Actualizar Propiedad
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}