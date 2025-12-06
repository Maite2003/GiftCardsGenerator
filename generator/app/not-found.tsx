import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      <h2 className="text-6xl font-bold text-chapita-orange mb-4">404</h2>
      <p className="text-xl text-chapita-dark font-semibold mb-6">
        Esta página no existe.
      </p>
      <Link 
        href="/"
        className="bg-chapita-dark text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}