'use client';

import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImageSrc(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/giftcard', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al generar la tarjeta');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageSrc(url);

    } catch (err) {
      setError('Hubo un problema creando la tarjeta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      
      {/* Form card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-chapita-orange">
        <h2 className="text-2xl font-bold text-chapita-dark mb-6 text-center">
          Nueva Gift Card
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-chapita-dark mb-1">Nombre del Cliente</label>
            <input 
              type="text" 
              name="name" 
              required
              placeholder="Ej: Matías Ariel"
              className="w-full p-3 border-2 border-chapita-taupe/30 rounded-lg focus:border-chapita-orange focus:outline-none text-lg"
            />
          </div>

          {/* Total */}
          <div>
            <label className="block text-sm font-bold text-chapita-dark mb-1">Monto ($)</label>
            <input 
              type="number" 
              name="total" 
              required
              min="0"
              placeholder="Ej: 100000"
              className="w-full p-3 border-2 border-chapita-taupe/30 rounded-lg focus:border-chapita-orange focus:outline-none text-lg font-mono"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-bold text-chapita-dark mb-1">Mensaje (Opcional)</label>
            <input 
              type="text" 
              name="msg" 
              maxLength={100}
              placeholder="Ej: ¡Feliz Cumple! De parte de..."
              className="w-full p-3 border-2 border-chapita-taupe/30 rounded-lg focus:border-chapita-orange focus:outline-none"
            />
          </div>

          {/* Action button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-chapita-orange hover:bg-yellow-500 text-chapita-dark font-bold py-4 rounded-lg transition-colors text-lg shadow-sm disabled:opacity-50"
          >
            {loading ? 'Generando...' : '✨ Crear Gift Card'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-600 text-center font-medium bg-red-50 p-2 rounded">
            {error}
          </p>
        )}
      </div>

      {/* Download and preview */}
      {imageSrc && (
        <div className="bg-white rounded-xl shadow-lg p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-bold text-chapita-dark mb-4">Vista Previa:</h3>
          
          <div className="rounded-lg overflow-hidden border border-gray-200 mb-6">
            <img src={imageSrc} alt="Gift Card Generada" className="w-full h-auto" />
          </div>

          <a 
            href={imageSrc} 
            download={`giftcard-chapita-${Date.now()}.png`}
            className="block w-full bg-chapita-dark text-white text-center font-bold py-3 rounded-lg hover:bg-black transition-colors"
          >
            ⬇️ Descargar Imagen
          </a>
        </div>
      )}
    </div>
  );
}