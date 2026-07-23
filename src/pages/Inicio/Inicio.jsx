import React from 'react';
import { Link } from 'react-router-dom';

function Inicio() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* Sección Hero con el Logo Gigante */}
      <section className="relative bg-[#F5EEFD] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center text-center relative z-10">
          
          {/* El Logo Protagonista */}
          <img 
            src="/logo.png" 
            alt="MoniMila Bakery" 
            className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl mb-8 transition-transform hover:scale-105 duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          {/* Respaldo por si tarda en cargar la imagen */}
          <h1 className="hidden text-4xl md:text-6xl font-serif font-bold text-[#4A2B50] mb-6">
            MoniMila Bakery
          </h1>

          <span className="text-sm font-bold tracking-widest text-[#4A2B50] uppercase mb-4 bg-white px-5 py-2 rounded-full shadow-sm">
            Repostería Artesanal
          </span>
          
          <p className="text-xl md:text-2xl text-[#4A2B50] font-serif font-bold italic mb-10">
            "Bocaditos para el alma."
          </p>

          <div className="flex gap-4 flex-col sm:flex-row">
            <Link 
              to="/catalogo" 
              className="bg-[#4A2B50] hover:bg-opacity-90 text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-cake-candles"></i> Ver el Menú
            </Link>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-10 left-10 text-[#E8D8F8] opacity-50 text-6xl transform -rotate-12">
          <i className="fa-solid fa-cookie"></i>
        </div>
        <div className="absolute bottom-10 right-10 text-[#E8D8F8] opacity-50 text-6xl transform rotate-12">
          <i className="fa-solid fa-star"></i>
        </div>
      </section>

      {/* Sección de Especialidades */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif text-[#4A2B50] mb-4">Nuestras Especialidades</h2>
            <p className="text-slate-500">La fusión perfecta entre lo clásico y el cuidado en cada detalle.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Tarjeta Alfajores */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col md:flex-row items-center gap-8 hover:shadow-md transition-shadow">
              <div className="w-32 h-32 shrink-0 bg-[#F5EEFD] rounded-full flex items-center justify-center text-5xl text-[#4A2B50]">
                <i className="fa-solid fa-cookie-bite"></i>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-[#4A2B50] mb-3">Alfajores Clásicos</h3>
                <p className="text-slate-600 mb-4">Galletas que se deshacen en la boca, preparadas siguiendo la tradición familiar.</p>
              </div>
            </div>

            {/* Tarjeta Roscas y Figuras */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col md:flex-row items-center gap-8 hover:shadow-md transition-shadow">
              <div className="w-32 h-32 shrink-0 bg-[#F5EEFD] rounded-full flex items-center justify-center text-5xl text-[#4A2B50]">
                <i className="fa-solid fa-crown"></i>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-[#4A2B50] mb-3">Roscas de Temporada</h3>
                <p className="text-slate-600 mb-4">Receta tradicional con figuras temáticas de diseño exclusivo escondidas en su interior.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Inicio;
