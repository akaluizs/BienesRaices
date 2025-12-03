'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useImageUpload } from '@/hooks/useImageUpload';
import { createProperty } from '@/lib/actions/propertyActions';
import Image from 'next/image';
import {
  Plus,
  Loader2,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Home,
  Zap,
  Star,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NuevaPropiedadPage() {
  const router = useRouter();
  const { processImage, uploading, progress } = useImageUpload();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    ubicacion: '',
    precio: '',
    tipo: '',
    metros2: '',
    habitaciones: '',
    banos: '',
    VentaPreventa: 'Venta',
    codigo: '',
    imagenes: [],
    imagenesPreview: [],
    headerImageIndex: 0, // ✅ Índice de imagen principal
  });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // ✅ Crear slug seguro del título
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // ✅ Manejar selección de imágenes múltiples
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Validar cantidad máxima (10 imágenes)
    if (formData.imagenes.length + files.length > 10) {
      showAlert('error', 'Máximo 10 imágenes por propiedad');
      return;
    }

    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push({
          file,
          preview: event.target.result,
        });

        if (newPreviews.length === files.length) {
          setFormData(prev => ({
            ...prev,
            imagenes: [...prev.imagenes, ...files],
            imagenesPreview: [...prev.imagenesPreview, ...newPreviews],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // ✅ Remover imagen individual
  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const nuevaPreview = prev.imagenesPreview.filter((_, i) => i !== index);
      const nuevasImagenes = prev.imagenes.filter((_, i) => i !== index);
      
      // Si eliminamos la imagen principal, seleccionar la primera
      let nuevoIndice = prev.headerImageIndex;
      if (nuevoIndice >= nuevasImagenes.length) {
        nuevoIndice = Math.max(0, nuevasImagenes.length - 1);
      }

      return {
        ...prev,
        imagenes: nuevasImagenes,
        imagenesPreview: nuevaPreview,
        headerImageIndex: nuevoIndice,
      };
    });
  };

  // ✅ Establecer imagen como principal
  const setHeaderImage = (index) => {
    setFormData(prev => ({
      ...prev,
      headerImageIndex: index,
    }));
  };

  // ✅ Guardar propiedad
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      showAlert('error', 'El título es obligatorio');
      return;
    }

    if (formData.imagenes.length === 0) {
      showAlert('error', 'Debes agregar al menos una imagen');
      return;
    }

    if (!formData.tipo) {
      showAlert('error', 'Selecciona un tipo de propiedad');
      return;
    }

    setLoading(true);
    try {
      const slug = createSlug(formData.titulo);
      const imageUrls = [];

      // Subir cada imagen a R2
      for (let i = 0; i < formData.imagenes.length; i++) {
        setUploadStatus(`Subiendo imagen ${i + 1}/${formData.imagenes.length}...`);

        const result = await processImage(
          formData.imagenes[i],
          'propiedades',
          slug,
          (msg) => setUploadStatus(msg)
        );

        imageUrls.push(result.url);
      }

      setUploadStatus('Guardando propiedad en base de datos...');

      // ✅ IMAGEN PRINCIPAL: usar la URL del índice seleccionado
      const headerImageUrl = imageUrls[formData.headerImageIndex] || imageUrls[0];

      // ✅ Preparar datos para insertar
      const propertyData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        ubicacion: formData.ubicacion,
        precio: parseFloat(formData.precio),
        tipo: formData.tipo,
        metros2: parseFloat(formData.metros2) || 0,
        habitaciones: parseInt(formData.habitaciones) || 0,
        banos: parseInt(formData.banos) || 0,
        imagenes: imageUrls,
        header_image: headerImageUrl, // ✅ NUEVA COLUMNA
        VentaPreventa: formData.VentaPreventa,
        codigo: formData.codigo || null,
      };

      // ✅ Usar Server Action con revalidación automática
      const result = await createProperty(propertyData);

      if (!result.success) {
        throw new Error(result.error);
      }

      showAlert('success', result.message || 'Propiedad creada exitosamente');
      setUploadStatus('');
      
      // ✅ Esperar un poco para que se vea el mensaje de éxito
      setTimeout(() => {
        router.push('/admin/propiedades');
        router.refresh(); // Forzar refresh para ver los cambios inmediatamente
      }, 1500);
    } catch (error) {
      console.error('Error creando propiedad:', error);
      showAlert('error', error.message || 'Error al crear la propiedad');
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
          Nueva Propiedad
        </h1>
        <p className="text-gris-oscuro/70 mt-2">Crea una nueva propiedad en el sistema</p>
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
              <p className="text-sm font-bold text-gris-oscuro mb-2">Título *</p>
              <Input
                type="text"
                placeholder="Ej: Casa moderna en Zona 10"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                className="border-2 border-gris-medio focus:border-naranja py-6 text-base rounded-xl"
              />
              <p className="text-xs text-gris-oscuro/70 mt-2">
                💡 Se creará una carpeta en R2: <span className="font-bold text-naranja">/propiedades/{createSlug(formData.titulo)}/</span>
              </p>
            </label>
          </CardContent>
        </Card>

        {/* DESCRIPCIÓN */}
        <Card className="border-2 border-gris-medio">
          <CardContent className="p-6">
            <label className="block mb-3">
              <p className="text-sm font-bold text-gris-oscuro mb-2">Descripción *</p>
              <textarea
                placeholder="Describe los detalles de la propiedad..."
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full border-2 border-gris-medio focus:border-naranja rounded-xl p-4 text-base resize-none"
                rows="6"
                required
              />
            </label>
          </CardContent>
        </Card>

        {/* UBICACIÓN Y PRECIO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-gris-medio">
            <CardContent className="p-6">
              <label className="block mb-3">
                <p className="text-sm font-bold text-gris-oscuro mb-2">Ubicación *</p>
                <Input
                  type="text"
                  placeholder="Ej: Zona 10, Guatemala"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
                  className="border-2 border-gris-medio focus:border-naranja py-6 text-base rounded-xl"
                  required
                />
              </label>
            </CardContent>
          </Card>

          <Card className="border-2 border-gris-medio">
            <CardContent className="p-6">
              <label className="block mb-3">
                <p className="text-sm font-bold text-gris-oscuro mb-2">Precio (Q) *</p>
                <Input
                  type="number"
                  placeholder="1,000,000"
                  value={formData.precio}
                  onChange={(e) => setFormData(prev => ({ ...prev, precio: e.target.value }))}
                  className="border-2 border-gris-medio focus:border-naranja py-6 text-base rounded-xl"
                  required
                />
              </label>
            </CardContent>
          </Card>
        </div>

        {/* TIPO Y CARACTERÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-gris-medio">
            <CardContent className="p-6">
              <label className="block mb-3">
                <p className="text-sm font-bold text-gris-oscuro mb-2">Tipo de Propiedad *</p>
                <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger className="border-2 border-gris-medio focus:border-naranja py-6 rounded-xl bg-blanco">
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
                    <SelectItem value="Casa">🏠 Casa</SelectItem>
                    <SelectItem value="Apartamento">🏢 Apartamento</SelectItem>
                    <SelectItem value="Terreno">🌱 Terreno</SelectItem>
                    <SelectItem value="Local Comercial">🏪 Local Comercial</SelectItem>
                    <SelectItem value="Oficina">🏛️ Oficina</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </CardContent>
          </Card>

          <Card className="border-2 border-gris-medio">
            <CardContent className="p-6">
              <label className="block mb-3">
                <p className="text-sm font-bold text-gris-oscuro mb-2">Metros² *</p>
                <Input
                  type="number"
                  placeholder="250"
                  value={formData.metros2}
                  onChange={(e) => setFormData(prev => ({ ...prev, metros2: e.target.value }))}
                  className="border-2 border-gris-medio focus:border-naranja py-6 text-base rounded-xl"
                  required
                />
              </label>
            </CardContent>
          </Card>
        </div>

        {/* HABITACIONES Y BAÑOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-gris-medio">
            <CardContent className="p-6">
              <label className="block mb-3">
                <p className="text-sm font-bold text-gris-oscuro mb-2">Habitaciones *</p>
                <Input
                  type="number"
                  placeholder="3"
                  value={formData.habitaciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, habitaciones: e.target.value }))}
                  className="border-2 border-gris-medio focus:border-naranja py-6 text-base rounded-xl"
                  required
                />
              </label>
            </CardContent>
          </Card>

          <Card className="border-2 border-gris-medio">
            <CardContent className="p-6">
              <label className="block mb-3">
                <p className="text-sm font-bold text-gris-oscuro mb-2">Baños *</p>
                <Input
                  type="number"
                  placeholder="2"
                  value={formData.banos}
                  onChange={(e) => setFormData(prev => ({ ...prev, banos: e.target.value }))}
                  className="border-2 border-gris-medio focus:border-naranja py-6 text-base rounded-xl"
                  required
                />
              </label>
            </CardContent>
          </Card>
        </div>

        {/* ESTADO DE VENTA Y CÓDIGO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-gris-medio">
            <CardContent className="p-6">
              <label className="block mb-3">
                <p className="text-sm font-bold text-gris-oscuro mb-2">Estado</p>
                <Select value={formData.VentaPreventa} onValueChange={(value) => setFormData(prev => ({ ...prev, VentaPreventa: value }))}>
                  <SelectTrigger className="border-2 border-gris-medio focus:border-naranja py-6 rounded-xl bg-blanco">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent 
                    className="!bg-blanco !opacity-100 border-2 border-gris-medio shadow-2xl"
                    style={{
                      backgroundColor: '#FFFFFF',
                      backdropFilter: 'none',
                      opacity: 1
                    }}
                  >
                    <SelectItem value="Venta">💰 Venta</SelectItem>
                    <SelectItem value="Preventa">🔄 Preventa</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </CardContent>
          </Card>

          <Card className="border-2 border-gris-medio">
            <CardContent className="p-6">
              <label className="block mb-3">
                <p className="text-sm font-bold text-gris-oscuro mb-2">Código</p>
                <Input
                  type="text"
                  placeholder="Ej: PROP-001"
                  value={formData.codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                  className="border-2 border-gris-medio focus:border-naranja py-6 text-base rounded-xl"
                />
              </label>
            </CardContent>
          </Card>
        </div>

        {/* IMÁGENES */}
        <Card className="border-2 border-gris-medio">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-gris-oscuro mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-naranja" />
              Imágenes de la Propiedad ({formData.imagenes.length}/10) *
            </p>

            {formData.imagenesPreview.length === 0 ? (
              <label className="block border-2 border-dashed border-gris-medio rounded-xl p-8 text-center cursor-pointer hover:border-naranja hover:bg-naranja/5 transition-all">
                <Upload className="w-12 h-12 text-gris-oscuro/50 mx-auto mb-3" />
                <p className="font-bold text-gris-oscuro mb-1">Sube imágenes de la propiedad</p>
                <p className="text-sm text-gris-oscuro/70">JPG, PNG (hasta 10 imágenes)</p>
                <p className="text-xs text-gris-oscuro/60 mt-2 flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Se optimizarán a WebP automáticamente
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="hidden"
                />
              </label>
            ) : (
              <>
                <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <p className="text-xs font-bold text-blue-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Haz clic en una imagen para establecerla como imagen principal
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {formData.imagenesPreview.map((item, index) => (
                    <div
                      key={index}
                      className="relative group rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => setHeaderImage(index)}
                    >
                      <Image
                        src={item.preview}
                        alt={`Preview ${index + 1}`}
                        width={300}
                        height={200}
                        className={`w-full h-32 object-cover transition-all ${
                          formData.headerImageIndex === index
                            ? 'ring-4 ring-naranja scale-95'
                            : 'group-hover:scale-105'
                        }`}
                      />
                      {/* ✅ BADGE DE IMAGEN PRINCIPAL */}
                      {formData.headerImageIndex === index && (
                        <div className="absolute inset-0 bg-naranja/20 flex items-center justify-center">
                          <Star className="w-8 h-8 text-naranja fill-naranja" />
                        </div>
                      )}
                      
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-blanco rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}

                  {/* Botón para agregar más */}
                  {formData.imagenes.length < 10 && (
                    <label className="border-2 border-dashed border-gris-medio rounded-xl p-4 flex items-center justify-center cursor-pointer hover:border-naranja hover:bg-naranja/5 transition-all h-32">
                      <div className="text-center">
                        <Plus className="w-6 h-6 text-gris-oscuro/50 mx-auto mb-1" />
                        <span className="text-xs text-gris-oscuro/70 font-bold">Agregar más</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </>
            )}
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
                Crear Propiedad
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}