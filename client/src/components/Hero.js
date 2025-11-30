'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Imagen de fondo con aspect ratio nativo */}
      <div className="relative w-full" style={{ aspectRatio: '2048/762' }}>
        <Image
          src="/images/Hero.webp"
          alt="Propiedades en Quetzaltenango - Multinmuebles"
          fill
          priority
          className="object-contain"
          quality={95}
          sizes="100vw"
        />
      </div>
    </section>
  );
}