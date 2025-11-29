import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Bienes Raíces - Encuentra tu Hogar',
  description: 'Plataforma de bienes raíces con las mejores propiedades',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-white">
        <Navbar />
        
        <main>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}