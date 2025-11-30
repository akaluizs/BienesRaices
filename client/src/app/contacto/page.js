'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  asunto: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  propiedad: z.string().optional(),
});

export default function ContactoPage() {
  const [loading, setLoading] = useState(false);
  const [propiedades, setPropiedades] = useState([]);
  const [loadingPropiedades, setLoadingPropiedades] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: '',
      propiedad: '',
    },
  });

  useEffect(() => {
    loadPropiedades();
  }, []);

  const loadPropiedades = async () => {
    try {
      const { data, error } = await supabase
        .from('propiedades')
        .select('id, titulo, precio, tipo')
        .order('titulo', { ascending: true });

      if (error) throw error;
      setPropiedades(data || []);
    } catch (error) {
      console.error('Error cargando propiedades:', error);
      toast.error('Error al cargar las propiedades');
    } finally {
      setLoadingPropiedades(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const loadingToast = toast.loading('Enviando mensaje...');
    
    try {
      const { error } = await supabase
        .from('contactos')
        .insert([{
          nombre: values.nombre,
          email: values.email,
          telefono: values.telefono,
          asunto: values.asunto,
          mensaje: values.mensaje,
          propiedad_id: values.propiedad || null,
          estado: 'nuevo'
        }]);
      
      if (error) throw error;
      
      form.reset();
      toast.success('¡Mensaje enviado exitosamente!', {
        id: loadingToast,
        description: 'Nos pondremos en contacto contigo pronto.',
        duration: 4000,
      });
    } catch (error) {
      console.error(error);
      toast.error('Error al enviar el mensaje', {
        id: loadingToast,
        description: 'Por favor, intenta nuevamente.',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="body-theme min-h-screen contact-page">
      {/* HERO CONTACTO */}
      <section className="hero-theme py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-niebla mb-4">Contáctanos</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-niebla opacity-90">
            ¿Tienes preguntas? Nos encantaría escucharte. Envía un mensaje y nos pondremos en contacto pronto.
          </p>
        </div>
      </section>
      {/* CONTENIDO PRINCIPAL */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FORMULARIO */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* NOMBRE Y EMAIL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-granito mb-2">Nombre Completo</label>
                      <input
                        type="text"
                        placeholder="Juan Pérez"
                        {...form.register('nombre')}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde focus:border-transparent transition"
                      />
                      {form.formState.errors.nombre && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.nombre.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-granito mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        {...form.register('email')}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde focus:border-transparent transition"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* TELÉFONO Y ASUNTO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-granito mb-2">Teléfono</label>
                      <input
                        type="tel"
                        placeholder="+502 7000 0000"
                        {...form.register('telefono')}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde focus:border-transparent transition"
                      />
                      {form.formState.errors.telefono && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.telefono.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-granito mb-2">Asunto</label>
                      <input
                        type="text"
                        placeholder="Información sobre una propiedad"
                        {...form.register('asunto')}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde focus:border-transparent transition"
                      />
                      {form.formState.errors.asunto && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.asunto.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* SELECTOR DE PROPIEDAD */}
                  <div>
                    <label className="block text-sm font-semibold text-granito mb-2">Propiedad de Interés (Opcional)</label>
                    <select
                      {...form.register('propiedad')}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde focus:border-transparent transition bg-white"
                      disabled={loadingPropiedades}
                    >
                      <option value="">Selecciona una propiedad</option>
                      {propiedades.map((prop) => (
                        <option key={prop.id} value={prop.id}>
                          {prop.titulo} - Q{prop.precio?.toLocaleString()} {prop.tipo && `(${prop.tipo})`}
                        </option>
                      ))}
                    </select>
                    {loadingPropiedades && (
                      <p className="text-sm text-granito mt-1">Cargando propiedades...</p>
                    )}
                  </div>

                  {/* MENSAJE */}
                  <div>
                    <label className="block text-sm font-semibold text-granito mb-2">Mensaje</label>
                    <textarea
                      placeholder="Cuéntanos más sobre lo que necesitas..."
                      rows={6}
                      {...form.register('mensaje')}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cerro-verde focus:border-transparent transition resize-none"
                    />
                    {form.formState.errors.mensaje && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.mensaje.message}
                      </p>
                    )}
                  </div>

                  {/* BOTÓN ENVIAR */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cerro-verde hover:bg-xela-navy text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    <span>{loading ? 'Enviando...' : 'Enviar Mensaje'}</span>
                  </button>

                  <p className="text-xs text-granito text-center">
                    Nos comprometemos a responder tu mensaje en menos de 24 horas.
                  </p>
                </form>
              </div>
            </div>

            {/* INFORMACIÓN DE CONTACTO */}
            <div className="space-y-6">
              {/* TARJETA TELÉFONO */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-cerro-verde/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-cerro-verde" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-granito uppercase tracking-wide">Teléfono</p>
                    <p className="text-lg font-bold text-xela-navy">+502 4000 0000</p>
                  </div>
                </div>
                <p className="text-sm text-granito">Disponible de lunes a viernes, 8am - 6pm</p>
              </div>

              {/* TARJETA EMAIL */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-arena/30 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-arena" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-granito uppercase tracking-wide">Email</p>
                    <p className="text-sm font-bold text-xela-navy">contacto@bienesraices.com</p>
                  </div>
                </div>
                <p className="text-sm text-granito">Responderemos en menos de 24 horas</p>
              </div>

              {/* TARJETA UBICACIÓN */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-xela-navy/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-xela-navy" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-granito uppercase tracking-wide">Ubicación</p>
                    <p className="text-lg font-bold text-xela-navy">Quetzaltenango, Guatemala</p>
                  </div>
                </div>
                <p className="text-sm text-granito">Zona 3, Centro Comercial</p>
              </div>

              {/* TARJETA WHATSAPP */}
              <a
                href="https://wa.me/50240000000"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-all duration-300 group"
                onClick={() => toast.info('Abriendo WhatsApp...', { duration: 2000 })}
              >
                <p className="text-sm font-semibold mb-2 opacity-90">Contacto Rápido</p>
                <p className="text-2xl font-bold mb-3 group-hover:translate-x-2 transition-transform">
                  WhatsApp
                </p>
                <p className="text-sm opacity-90">Mensajería instantánea disponible 24/7</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MAPA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-xela-navy mb-12">Ubicación</h2>
          <div className="rounded-2xl overflow-hidden shadow-lg h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.719642438568!2d-91.5189!3d14.8453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85894a5d2abcd123%3A0xee7b2ce060a9c9e7!2sQuetzaltenango!5e0!3m2!1ses!2sgt!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Ubicación BienesRaíces"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}