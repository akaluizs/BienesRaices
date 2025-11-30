'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  LogIn, 
  AlertCircle, 
  CheckCircle, 
  Shield,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Login con Supabase Auth
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      // Verificar si es administrador
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        throw new Error('No tienes permisos de administrador');
      }

      setSuccess('¡Login exitoso! Redirigiendo...');
      
      // Guardar en localStorage
      localStorage.setItem('admin_id', admin.id);
      localStorage.setItem('admin_email', admin.email);
      localStorage.setItem('admin_nombre', admin.nombre);

      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gris-claro via-blanco to-gris-claro flex items-center justify-center py-12 px-4 relative overflow-hidden">
      
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-naranja rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-amarillo-dorado rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* LOGO Y TÍTULO */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-cta rounded-2xl shadow-naranja mb-4">
            <Shield className="w-10 h-10 text-blanco" />
          </div>
          
          <h1 className="text-4xl font-extrabold text-gris-oscuro mb-2">
            Panel <span className="text-naranja">Administrador</span>
          </h1>
          
          <p className="text-gris-oscuro/70 text-lg">
            Gestiona propiedades y contenido
          </p>
        </div>

        {/* CARD FORMULARIO */}
        <Card className="border-2 border-gris-medio shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-gris-oscuro text-center">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center text-gris-oscuro/70">
              Ingresa tus credenciales de administrador
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            
            {/* ALERTAS */}
            {error && (
              <Alert className="bg-red-50 border-2 border-red-500">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800 font-semibold ml-2">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-2 border-green-500">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800 font-semibold ml-2">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* FORMULARIO */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* EMAIL */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gris-oscuro font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-naranja" />
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@multinmuebles.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="border-2 border-gris-medio focus:border-naranja h-12 text-base"
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gris-oscuro font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-naranja" />
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="border-2 border-gris-medio focus:border-naranja h-12 text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gris-oscuro/50 hover:text-naranja transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* BOTÓN LOGIN */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-cta h-12 text-base font-bold shadow-naranja mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>

            {/* SEPARADOR */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gris-medio"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-blanco px-2 text-gris-oscuro/50 font-semibold">
                  Acceso restringido
                </span>
              </div>
            </div>

            {/* INFO ADICIONAL */}
            <div className="bg-naranja/5 border border-naranja/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-naranja flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gris-oscuro mb-1">
                    Panel de Administración
                  </p>
                  <p className="text-xs text-gris-oscuro/70 leading-relaxed">
                    Solo usuarios autorizados pueden acceder. Tus credenciales son 
                    privadas y protegidas.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FOOTER */}
        <div className="mt-6 text-center space-y-2">
          
          <p className="text-xs text-gris-oscuro/40">
            © 2025 Multinmuebles. Todos los derechos reservados.
          </p>
        </div>

        {/* BACK TO HOME */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-gris-oscuro/70 hover:text-naranja transition-colors font-semibold"
          >
            ← Volver al sitio principal
          </Link>
        </div>
      </div>
    </div>
  );
}