'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('propiedades')
        .select('*');

      if (fetchError) throw fetchError;

      setProperties(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="body-theme min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-xela-navy mb-6">Test Supabase</h1>

        {loading && <p className="text-granito">Cargando...</p>}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">✅ Conexión exitosa!</p>
            <p>Se encontraron {properties.length} propiedades</p>
          </div>
        )}

        {properties.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-xela-navy mb-4">Propiedades encontradas:</h2>
            <ul className="space-y-2">
              {properties.map((prop) => (
                <li key={prop.id} className="p-3 bg-niebla rounded">
                  <p className="font-bold text-xela-navy">{prop.titulo}</p>
                  <p className="text-sm text-granito">Q {prop.precio?.toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}