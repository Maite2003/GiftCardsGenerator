import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Generador Gift Cards - La Chapita",
  description: "Herramienta interna para generar tarjetas de regalo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-chapita-beige min-h-screen flex flex-col`}>
        
        <header className="bg-chapita-dark shadow-lg border-b-4 border-chapita-orange relative z-10">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
            
              <img 
                src="/logo.png" 
                alt="Logo La Chapita" 
                className="h-14 w-14 object-contain" 
              />

            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-chapita-orange tracking-wide leading-none">
                LA CHAPITA MDP
              </h1>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-1">
                Generador de Gift Cards
              </p>
            </div>
          </div>
        </header>

        {/* Form */}
        <main className="grow p-4">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-chapita-dark text-chapita-taupe text-center p-4 text-sm font-medium border-t border-chapita-taupe/20">
          <p>© {new Date().getFullYear()} La Chapita MDP - Uso interno</p>
        </footer>
      </body>
    </html>
  );
}