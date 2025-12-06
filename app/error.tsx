'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] px-4 text-center">
      <h2 className="text-2xl font-bold text-chapita-dark mb-4">
        ¡Ups! Algo salió mal.
      </h2>
      <p className="text-chapita-taupe mb-6 max-w-md">
        Hubo un error al intentar cargar la aplicación. Puede ser un problema temporal.
      </p>
      <button
        onClick={reset}
        className="bg-chapita-orange text-chapita-dark px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}