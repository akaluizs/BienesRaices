'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
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
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
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

export default function NuevaPropiedadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [alert, setAlert] = useState(null);
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

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      tipo: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validar cantidad máxima de imágenes
    if (imagePreviews.length + files.length > 10) {
      showAlert('warning', 'Máximo 10 imágenes permitidas', 
        `Ya tienes ${imagePreviews.length} imágenes. Puedes agregar ${10 - imagePreviews.length} más.`);
      return;
    }

    // Validar tamaño de cada archivo
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (let file of files) {
      if (file.size > maxSize) {
        showAlert('error', 'Imagen demasiado grande', 
          `${file.name} excede el tamaño máximo de 5MB`);
        return;
      }
    }

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
        
        showAlert('success', `${files.length} imagen(es) agregada(s)`);
      })
      .catch(error => {
        console.error('Error procesando imágenes:', error);
        showAlert('error', 'Error al procesar las imágenes');
      });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
    showAlert('success', 'Imagen eliminada');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
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
      const { data, error } = await supabase
        .from('propiedades')
        .insert([{
          titulo: formData.titulo,
          tipo: formData.tipo,
          precio: parseFloat(formData.precio),
          ubicacion: formData.ubicacion,
          descripcion: formData.descripcion || null,
          habitaciones: parseInt(formData.habitaciones) || null,
          banos: parseInt(formData.banos) || null,
          metros2: parseInt(formData.metros2) || null,
          imagenes: formData.imagenes
        }])
        .select();

      if (error) throw error;

      showAlert('success', '¡Propiedad creada exitosamente!', 
        'Redirigiendo al listado...');

      setTimeout(() => {
        router.push('/admin/propiedades');
      }, 1500);
    } catch (error) {
      console.error('Error creando propiedad:', error);
      showAlert('error', 'Error al crear la propiedad', error.message);
    } finally {
      setLoading(false);
    }
  };

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
            Nueva Propiedad
          </h1>
          <p className="text-gris-oscuro/70 mt-2 text-lg">
            Completa los campos para agregar una propiedad
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
            
            {/* PREVIEWS GRID */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl border-2 border-gris-medio group-hover:border-naranja transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-blanco rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <Badge className="absolute bottom-2 left-2 bg-gradient-cta text-blanco font-bold shadow-naranja">
                        Principal
                      </Badge>
                    )}
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
                  <p className="text-xs text-naranja font-bold mt-2">
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
                    <SelectItem value="Casa" className="!bg-blanco hover:!bg-gris-claro cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
                      Casa
                    </SelectItem>
                    <SelectItem value="Apartamento" className="!bg-blanco hover:!bg-gris-claro cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
                      Apartamento
                    </SelectItem>
                    <SelectItem value="Terreno" className="!bg-blanco hover:!bg-gris-claro cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
                      Terreno
                    </SelectItem>
                    <SelectItem value="Local Comercial" className="!bg-blanco hover:!bg-gris-claro cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
                      Local Comercial
                    </SelectItem>
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
                <Home className="w-5 h-5 mr-2" />
                Crear Propiedad
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}