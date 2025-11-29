'use client';

export default function Hero() {
  return (
    <section className="relative h-screen hero-theme overflow-hidden">

      {/* Overlay degradado */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-xl">
            Encuentra tu <span className="text-arena">Hogar Ideal</span> en Quetzaltenango
          </h1>

          <p className="text-xl md:text-2xl text-niebla mt-6">
            Descubre propiedades verificadas en las mejores zonas de Xela. Casas, apartamentos y
            terrenos con precios competitivos, asesoría profesional y gestión confiable para tu
            inversión o nuevo hogar.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="mt-16 grid grid-cols-3 gap-10 text-center text-white">
          <div className="transition transform hover:scale-105">
            <p className="text-5xl font-bold text-arena">120+</p>
            <p className="text-niebla">Propiedades Disponibles</p>
          </div>
          <div className="transition transform hover:scale-105">
            <p className="text-5xl font-bold text-arena">300+</p>
            <p className="text-niebla">Clientes Satisfechos</p>
          </div>
          <div className="transition transform hover:scale-105">
            <p className="text-5xl font-bold text-arena">10+</p>
            <p className="text-niebla">Años de Experiencia</p>
          </div>
        </div>
      </div>

      {/* Flecha animada */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
