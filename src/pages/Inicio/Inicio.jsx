import React from 'react';
import { Link } from 'react-router-dom';

function Inicio() {
  return (
    <div className="min-h-screen bg-[#F5EEFD] text-[#4A2B50]">
      
      {/* Sección Hero (Encabezado Principal) */}
      <section className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'serif' }}>
          Bienvenidos a MoniMila
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl italic text-[#4A2B50]/80">
          Tradición, calidez y un pedacito de hogar en cada postre.
        </p>
        <Link 
          to="/catalogo" 
          className="bg-[#4A2B50] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-lg tracking-wide"
        >
          Ver Menú Delicioso
        </Link>
      </section>

      {/* Sección de Especialidades */}
      <section className="max-w-5xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Tarjeta 1 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#4A2B50] hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'serif' }}>Alfajores Artesanales</h2>
          <p className="text-slate-600 leading-relaxed">
            Rellenos del más suave dulce de leche, bañados en chocolate y preparados con nuestra receta tradicional para alegrar tu día.
          </p>
        </div>

        {/* Tarjeta 2 (La magia del 3D) */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#4A2B50] hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'serif' }}>Roscas y Figuras 3D</h2>
          <p className="text-slate-600 leading-relaxed">
            Revolucionamos la tradición. Descubre nuestras Roscas de Reyes personalizadas con muñecos temáticos exclusivos impresos en 3D.
          </p>
        </div>

      </section>
    </div>
  );
}

export default Inicio;
