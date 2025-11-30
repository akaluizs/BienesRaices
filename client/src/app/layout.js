import { Toaster } from "@/components/ui/sonner"
import './globals.css'
import ClientLayout from './ClientLayout'

export const metadata = {
  title: 'Multi inmuebles  - Encuentra tu Hogar',
  description: 'Plataforma de bienes raíces con las mejores propiedades',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-white">
        <ClientLayout>{children}</ClientLayout>
        <Toaster 
          position="top-right"
          duration={3000}
          closeButton
          richColors 
        />
      </body>
    </html>
  )
}