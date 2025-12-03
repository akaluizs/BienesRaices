'use client'

import { useState } from 'react'
import {
  revalidateProperties,
  revalidatePreventas,
  revalidatePropertyDetail,
  revalidateContacts,
  revalidateAll,
} from '@/lib/actions/revalidateCache'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function CacheManagementPage() {
  const [loading, setLoading] = useState(null)
  const [messages, setMessages] = useState([])

  const addMessage = (message, type = 'success') => {
    setMessages((prev) => [...prev, { message, type, id: Date.now() }])
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== Date.now()))
    }, 5000)
  }

  const handleRevalidate = async (action, label) => {
    try {
      setLoading(label)
      const result = await action()
      if (result.success) {
        addMessage(`✅ ${result.message}`, 'success')
      } else {
        addMessage(`❌ Error: ${result.error}`, 'error')
      }
    } catch (error) {
      addMessage(`❌ Error: ${error.message}`, 'error')
    } finally {
      setLoading(null)
    }
  }

  const cacheActions = [
    {
      label: 'Propiedades',
      description: 'Revalidar todas las propiedades',
      action: revalidateProperties,
      icon: '🏠',
    },
    {
      label: 'Preventas',
      description: 'Revalidar todos los proyectos en preventa',
      action: revalidatePreventas,
      icon: '🏗️',
    },
    {
      label: 'Detalles Propiedad',
      description: 'Revalidar páginas de detalles',
      action: revalidatePropertyDetail,
      icon: '📄',
    },
    {
      label: 'Contactos',
      description: 'Revalidar formularios de contacto',
      action: revalidateContacts,
      icon: '📧',
    },
    {
      label: 'Todo el Sitio',
      description: 'Revalidar todo el contenido en caché',
      action: revalidateAll,
      icon: '🌐',
      danger: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gris-claro py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <RefreshCw className="w-8 h-8 text-naranja" />
              <h1 className="text-4xl font-extrabold text-gris-oscuro">
                Gestión de <span className="text-naranja">Caché</span>
              </h1>
            </div>
            <p className="text-gris-oscuro/70 text-lg">
              Revalidar y actualizar datos en caché
            </p>
          </div>

          {/* Mensajes */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 p-4 rounded-lg border-2 flex items-center gap-3 ${
                msg.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              {msg.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <p
                className={
                  msg.type === 'success' ? 'text-green-900' : 'text-red-900'
                }
              >
                {msg.message}
              </p>
            </div>
          ))}

          {/* Acciones de Caché */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {cacheActions.map((action) => (
              <Card
                key={action.label}
                className={`hover:shadow-lg transition-all ${
                  action.danger ? 'border-2 border-red-200' : ''
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{action.icon}</span>
                    {action.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gris-oscuro/70">
                    {action.description}
                  </p>
                  <Button
                    onClick={() => handleRevalidate(action.action, action.label)}
                    disabled={loading !== null}
                    className={`w-full ${
                      action.danger
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'btn-cta'
                    }`}
                  >
                    {loading === action.label ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Revalidando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Revalidar
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Información */}
          <Card className="bg-blue-50 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">
                📝 Información de Caching
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-blue-900">
              <div>
                <p className="font-bold mb-1">Propiedades:</p>
                <p className="text-xs opacity-80">Revalidadas cada 1 hora (3600s)</p>
              </div>
              <div>
                <p className="font-bold mb-1">Preventas:</p>
                <p className="text-xs opacity-80">Revalidadas cada 1 hora (3600s)</p>
              </div>
              <div>
                <p className="font-bold mb-1">Imágenes:</p>
                <p className="text-xs opacity-80">Revalidadas cada 7 días (604800s)</p>
              </div>
              <div>
                <p className="font-bold mb-1">Datos Públicos:</p>
                <p className="text-xs opacity-80">Revalidadas cada 24 horas (86400s)</p>
              </div>
              <hr className="my-3 border-blue-200" />
              <p className="text-xs opacity-80">
                🔄 Usa estas herramientas para forzar una revalidación inmediata
                después de cambios importantes en la base de datos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}