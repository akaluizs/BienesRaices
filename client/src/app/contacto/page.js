'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Home
} from 'lucide-react';
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

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
    propiedad_id: ''
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Cargar propiedades al montar el componente
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('propiedades')
        .select('id, titulo')
        .order('titulo', { ascending: true });

      if (error) throw error;
      setProperties(data || []);
    } catch (err) {
      console.error('Error cargando propiedades:', err);
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
      propiedad_id: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { data, error: insertError } = await supabase
        .from('contactos')
        .insert([
          {
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            asunto: formData.asunto,
            mensaje: formData.mensaje,
            propiedad_id: formData.propiedad_id || null,
            estado: 'pendiente',
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: '',
        propiedad_id: ''
      });

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 5000);

    } catch (err) {
      console.error('Error enviando mensaje:', err);
      setError('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hola, me gustaría obtener más información sobre sus propiedades.`;
    const whatsappUrl = `https://wa.me/50240000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono',
      content: '+502 5556 6379',
      link: 'tel:+50240000000',
      color: 'text-naranja'
    },
    {
      icon: Mail,
      title: 'Correo Electrónico',
      content: 'multiinmuebles1974@gmail.com',
      link: 'mailto:multiinmuebles1974@gmail.com',
      color: 'text-rojo-naranja'
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      content: 'Quetzaltenango, Guatemala',
      link: null,
      color: 'text-amarillo-dorado'
    },
    {
      icon: Clock,
      title: 'Horario',
      content: 'Lun - Vie: 8:00 AM - 6:00 PM',
      link: null,
      color: 'text-naranja'
    }
  ];

  return (
    <div className="min-h-screen bg-gris-claro">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-primary text-blanco py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 right-10 w-64 h-64 bg-amarillo-dorado rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-blanco rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 bg-blanco/10 backdrop-blur-md border border-amarillo-dorado/30 rounded-full px-6 py-2 mb-6">
              <MessageCircle className="w-5 h-5 text-amarillo-dorado" />
              <span className="text-blanco font-semibold text-sm">
                Estamos para ayudarte
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Contáctanos <span className="text-amarillo-dorado">Hoy</span>
            </h1>
            
            <p className="text-xl text-blanco/90 leading-relaxed max-w-3xl mx-auto">
              ¿Tienes alguna pregunta sobre nuestras propiedades? Estamos aquí para 
              ayudarte a encontrar tu hogar ideal. Completa el formulario o comunícate 
              directamente con nosotros.
            </p>
          </div>
        </div>
      </section>

      {/* INFORMACIÓN DE CONTACTO */}
      <section className="py-12 bg-blanco">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card 
                  key={index}
                  className="border-2 border-gris-medio hover:border-naranja transition-all hover:shadow-xl group"
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-cta rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-naranja">
                        <Icon className="w-8 h-8 text-blanco" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gris-oscuro mb-2">
                      {info.title}
                    </h3>
                    
                    {info.link ? (
                      <a 
                        href={info.link}
                        className="text-gris-oscuro/70 hover:text-naranja transition-colors font-medium"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-gris-oscuro/70 font-medium">
                        {info.content}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FORMULARIO Y MAPA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* FORMULARIO */}
            <Card className="border-2 border-gris-medio hover:border-naranja transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gris-oscuro flex items-center gap-3">
                  <Send className="w-7 h-7 text-naranja" />
                  Envíanos un Mensaje
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Nombre */}
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-gris-oscuro font-semibold">
                      Nombre Completo <span className="text-rojo-naranja">*</span>
                    </Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="border-2 border-gris-medio focus:border-naranja"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gris-oscuro font-semibold">
                      Correo Electrónico <span className="text-rojo-naranja">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-2 border-gris-medio focus:border-naranja"
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-gris-oscuro font-semibold">
                      Teléfono
                    </Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      placeholder="+502 0000 0000"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="border-2 border-gris-medio focus:border-naranja"
                    />
                  </div>

                  {/* Propiedad Interesada */}
                  <div className="space-y-2">
                    <Label htmlFor="propiedad_id" className="text-gris-oscuro font-semibold">
                      Propiedad Interesada
                    </Label>
                    <Select value={formData.propiedad_id} onValueChange={handleSelectChange}>
                      <SelectTrigger className="border-2 border-gris-medio focus:border-naranja bg-blanco">
                        <Home className="w-5 h-5 text-naranja mr-2" />
                        <SelectValue placeholder="Selecciona una propiedad (opcional)" />
                      </SelectTrigger>
                      <SelectContent 
                        className="!bg-blanco !opacity-100 border-2 border-gris-medio shadow-2xl"
                        style={{
                          backgroundColor: '#FFFFFF',
                          backdropFilter: 'none',
                          opacity: 1
                        }}
                      >
                        <SelectItem 
                          value="ninguna" 
                          className="!bg-blanco hover:!bg-gris-claro cursor-pointer"
                          style={{ backgroundColor: '#FFFFFF' }}
                        >
                          Ninguna propiedad específica
                        </SelectItem>
                        {properties.map(property => (
                          <SelectItem 
                            key={property.id} 
                            value={property.id}
                            className="!bg-blanco hover:!bg-gris-claro cursor-pointer"
                            style={{ backgroundColor: '#FFFFFF' }}
                          >
                            {property.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gris-oscuro/60">
                      Si te interesa una propiedad en particular, selecciónala aquí
                    </p>
                  </div>

                  {/* Asunto */}
                  <div className="space-y-2">
                    <Label htmlFor="asunto" className="text-gris-oscuro font-semibold">
                      Asunto
                    </Label>
                    <Input
                      id="asunto"
                      name="asunto"
                      type="text"
                      placeholder="¿En qué podemos ayudarte?"
                      value={formData.asunto}
                      onChange={handleChange}
                      className="border-2 border-gris-medio focus:border-naranja"
                    />
                  </div>

                  {/* Mensaje */}
                  <div className="space-y-2">
                    <Label htmlFor="mensaje" className="text-gris-oscuro font-semibold">
                      Mensaje <span className="text-rojo-naranja">*</span>
                    </Label>
                    <Textarea
                      id="mensaje"
                      name="mensaje"
                      placeholder="Cuéntanos qué necesitas..."
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="border-2 border-gris-medio focus:border-naranja resize-none"
                    />
                  </div>

                  {/* Alertas */}
                  {success && (
                    <Alert className="bg-green-50 border-2 border-green-500">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <AlertDescription className="text-green-800 font-semibold">
                        ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
                      </AlertDescription>
                    </Alert>
                  )}

                  {error && (
                    <Alert className="bg-red-50 border-2 border-red-500">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <AlertDescription className="text-red-800 font-semibold">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Botón Submit */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-cta py-6 text-base font-bold shadow-naranja"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-gris-oscuro/70 text-center">
                    Al enviar este formulario, aceptas que nos pongamos en contacto contigo.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* MAPA Y CONTACTO RÁPIDO */}
            <div className="space-y-6">
              
              {/* Mapa */}
              <Card className="border-2 border-gris-medio overflow-hidden">
                <div className="h-[400px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.719642438568!2d-91.5189!3d14.8453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85894a5d2abcd123%3A0xee7b2ce060a9c9e7!2sQuetzaltenango!5e0!3m2!1ses!2sgt!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Ubicación Multinmuebles"
                  ></iframe>
                </div>
              </Card>

              {/* WhatsApp CTA */}
              <Card className="border-2 border-naranja/30 bg-gradient-to-br from-naranja/5 to-amarillo-dorado/5">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-cta rounded-full mb-4 shadow-naranja">
                      <MessageCircle className="w-10 h-10 text-blanco" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gris-oscuro mb-3">
                      ¿Necesitas respuesta inmediata?
                    </h3>
                    
                    <p className="text-gris-oscuro/70 mb-6">
                      Contáctanos por WhatsApp y recibe atención personalizada al instante.
                    </p>
                  </div>

                  <Button
                    onClick={handleWhatsApp}
                    className="w-full btn-cta py-6 text-base font-bold shadow-naranja group"
                  >
                    <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Chatear por WhatsApp
                  </Button>

                  <div className="mt-6 pt-6 border-t border-gris-medio">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-naranja mb-1">24/7</p>
                        <p className="text-xs text-gris-oscuro/70 font-semibold">Disponibilidad</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-naranja mb-1">&lt;5min</p>
                        <p className="text-xs text-gris-oscuro/70 font-semibold">Tiempo de Respuesta</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info adicional */}
              <Card className="border-2 border-gris-medio">
                <CardContent className="p-6">
                  <h4 className="font-bold text-gris-oscuro mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-naranja" />
                    ¿Por qué contactarnos?
                  </h4>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-gris-oscuro/80">
                      <CheckCircle className="w-4 h-4 text-naranja mt-0.5 flex-shrink-0" />
                      <span>Asesoría profesional sin costo</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gris-oscuro/80">
                      <CheckCircle className="w-4 h-4 text-naranja mt-0.5 flex-shrink-0" />
                      <span>Respuesta en menos de 24 horas</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gris-oscuro/80">
                      <CheckCircle className="w-4 h-4 text-naranja mt-0.5 flex-shrink-0" />
                      <span>Propuestas personalizadas a tu presupuesto</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gris-oscuro/80">
                      <CheckCircle className="w-4 h-4 text-naranja mt-0.5 flex-shrink-0" />
                      <span>Acompañamiento en todo el proceso</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}