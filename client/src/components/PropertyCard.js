'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Ruler, Users, Droplet, Car, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

  // Función para obtener color según el tipo
  const getTypeColor = (type) => {
    const colors = {
      'Casa': 'bg-blue-500',
      'Apartamento': 'bg-purple-500',
      'Terreno': 'bg-green-500',
      'Local Comercial': 'bg-orange-500',
      'Oficina': 'bg-cyan-500',
    };
    return colors[type] || 'bg-naranja';
  };

  return (
    <Card className="overflow-hidden border-2 border-gris-medio hover:border-naranja transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group h-full flex flex-col">
      
      {/* IMAGEN */}
      <CardHeader className="p-0 relative">
        <div className="relative h-56 w-full overflow-hidden bg-gris-claro">
          <Image
            src={image || '/placeholder.jpg'}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Overlay en hover */}
          <div className="absolute inset-0 bg-negro/0 group-hover:bg-negro/20 transition-all duration-300" />
          
          {/* Badge de tipo con color sólido */}
          <div className="absolute top-4 right-4">
            <Badge 
              className={`${getTypeColor(type)} text-blanco font-bold px-4 py-1.5 shadow-lg border-0`}
            >
              {type}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* CUERPO - flex-grow para empujar el footer abajo */}
      <CardContent className="p-6 flex-grow">
        
        {/* PRECIO EN NEGRITA */}
        <div className="mb-4">
          <h3 className="text-3xl font-extrabold text-naranja mb-1">
            Q {price.toLocaleString()}
          </h3>
          
          {/* UBICACIÓN */}
          <div className="flex items-center gap-2 text-gris-oscuro">
            <MapPin className="w-4 h-4 text-naranja" />
            <p className="text-sm font-medium">{location}</p>
          </div>
        </div>

        {/* TÍTULO (si lo tienes) */}
        {title && (
          <h4 className="text-lg font-bold text-gris-oscuro mb-2 line-clamp-1">
            {title}
          </h4>
        )}

        {/* DESCRIPCIÓN */}
        <p className="text-gris-oscuro/70 text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* DIVISOR */}
        <div className="border-t border-gris-medio my-4" />

        {/* DETALLES EN GRID */}
        <div className="grid grid-cols-2 gap-3">
          {area && (
            <div className="flex items-center gap-2 bg-gris-claro rounded-lg p-2.5 hover:bg-naranja/10 transition-colors">
              <div className="bg-naranja/20 p-1.5 rounded">
                <Ruler className="w-4 h-4 text-naranja" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gris-oscuro/60 font-medium">Área</span>
                <span className="text-sm text-gris-oscuro font-bold">{area} m²</span>
              </div>
            </div>
          )}

          {bedrooms && (
            <div className="flex items-center gap-2 bg-gris-claro rounded-lg p-2.5 hover:bg-naranja/10 transition-colors">
              <div className="bg-naranja/20 p-1.5 rounded">
                <Users className="w-4 h-4 text-naranja" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gris-oscuro/60 font-medium">Habitaciones</span>
                <span className="text-sm text-gris-oscuro font-bold">{bedrooms}</span>
              </div>
            </div>
          )}

          {bathrooms && (
            <div className="flex items-center gap-2 bg-gris-claro rounded-lg p-2.5 hover:bg-naranja/10 transition-colors">
              <div className="bg-naranja/20 p-1.5 rounded">
                <Droplet className="w-4 h-4 text-naranja" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gris-oscuro/60 font-medium">Baños</span>
                <span className="text-sm text-gris-oscuro font-bold">{bathrooms}</span>
              </div>
            </div>
          )}

          {parking && (
            <div className="flex items-center gap-2 bg-gris-claro rounded-lg p-2.5 hover:bg-naranja/10 transition-colors">
              <div className="bg-naranja/20 p-1.5 rounded">
                <Car className="w-4 h-4 text-naranja" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gris-oscuro/60 font-medium">Parqueo</span>
                <span className="text-sm text-gris-oscuro font-bold">{parking}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* FOOTER - Siempre al final */}
      <CardFooter className="p-6 pt-0 mt-auto">
        <Link href={`/propiedades/${id}`} className="w-full">
          <Button 
            className="w-full btn-cta py-6 text-base font-bold shadow-naranja group"
          >
            <Eye className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Ver Detalles
            <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}