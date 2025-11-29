'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Ruler, Users, Droplet, Car } from 'lucide-react';

export default function PropertyCard({ property }) {
  const {
    id,
    title,
    price,
    location,
    description,
    image,
    area,
    bedrooms,
    bathrooms,
    parking,
    type = 'Casa',
  } = property;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      
      {/* IMAGEN */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-200">
        <Image
          src={image || '/placeholder.jpg'}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-cerro-verde text-niebla px-3 py-1 rounded-lg text-sm font-semibold">
          {type}
        </div>
      </div>

      {/* CUERPO */}
      <div className="p-6">
        
        {/* PRECIO */}
        <h3 className="text-3xl font-bold text-cerro-verde mb-2">
          Q {price.toLocaleString()}
        </h3>

        {/* UBICACIÓN */}
        <div className="flex items-center gap-2 text-granito mb-3">
          <MapPin className="w-4 h-4" />
          <p className="text-sm">{location}</p>
        </div>

        {/* DESCRIPCIÓN */}
        <p className="text-granito text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* DETALLES */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {area && (
            <div className="flex items-center gap-2 bg-niebla/50 rounded-lg p-2">
              <Ruler className="w-4 h-4 text-xela-navy" />
              <span className="text-xs text-granito font-semibold">{area} m²</span>
            </div>
          )}
          {bedrooms && (
            <div className="flex items-center gap-2 bg-niebla/50 rounded-lg p-2">
              <Users className="w-4 h-4 text-xela-navy" />
              <span className="text-xs text-granito font-semibold">{bedrooms} Hab</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center gap-2 bg-niebla/50 rounded-lg p-2">
              <Droplet className="w-4 h-4 text-xela-navy" />
              <span className="text-xs text-granito font-semibold">{bathrooms} Baños</span>
            </div>
          )}
          {parking && (
            <div className="flex items-center gap-2 bg-niebla/50 rounded-lg p-2">
              <Car className="w-4 h-4 text-xela-navy" />
              <span className="text-xs text-granito font-semibold">{parking} Parqueo</span>
            </div>
          )}
        </div>

        {/* BOTÓN */}
        <Link
          href={`/propiedades/${id}`}
          className="w-full block text-center bg-cerro-verde hover:bg-xela-navy text-niebla font-bold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          Ver Propiedad
        </Link>
      </div>
    </div>
  );
}