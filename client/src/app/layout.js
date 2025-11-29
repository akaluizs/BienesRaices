import './globals.css'
import ClientLayout from './ClientLayout'

export const metadata = {
  title: 'Bienes Raíces - Encuentra tu Hogar',
  description: 'Plataforma de bienes raíces con las mejores propiedades',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}