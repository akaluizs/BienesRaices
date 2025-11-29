import PropertyCard from '@/components/PropertyCard';

export default function PropiedadesPage() {
  const properties = [
    {
      id: 1,
      title: 'Casa Moderna',
      price: 350000,
      location: 'Zona 3, Quetzaltenango',
      description: 'Casa moderna de 3 niveles con parqueo y patio trasero',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=400&fit=crop',
      area: 120,
      bedrooms: 3,
      bathrooms: 2,
      parking: 1,
      type: 'Casa',
    },
    {
      id: 2,
      title: 'Apartamento Céntrico',
      price: 250000,
      location: 'Centro, Quetzaltenango',
      description: 'Apartamento de 2 habitaciones en ubicación privilegiada',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop',
      area: 85,
      bedrooms: 2,
      bathrooms: 1,
      parking: 1,
      type: 'Apartamento',
    },
    {
      id: 3,
      title: 'Terreno Amplio',
      price: 150000,
      location: 'Zona 5, Quetzaltenango',
      description: 'Terreno de 500 m² ideal para construcción',
      image: 'https://images.unsplash.com/photo-1500382017468-7049ffd0c72c?w=500&h=400&fit=crop',
      area: 500,
      bedrooms: null,
      bathrooms: null,
      parking: null,
      type: 'Terreno',
    },
  ];

  return (
    <main className="body-theme min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-xela-navy mb-4 text-center">
          Nuestras Propiedades
        </h1>
        <p className="text-granito text-center mb-12 max-w-2xl mx-auto text-lg">
          Encuentra la propiedad ideal para ti. Contamos con una amplia variedad de opciones en Quetzaltenango.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </main>
  );
}