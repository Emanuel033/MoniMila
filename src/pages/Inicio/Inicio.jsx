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

      {/* Sección de Especialidades Actualizada */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif text-[#4A2B50] mb-4">Nuestras Especialidades</h2>
            <p className="text-slate-500">La fusión perfecta entre lo clásico, el cuidado a tu salud y los detalles únicos.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* 1. Tarjeta Alfajores */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-24 h-24 mb-6 bg-[#F5EEFD] rounded-full flex items-center justify-center text-4xl text-[#4A2B50] shadow-inner">
                <i className="fa-solid fa-cookie-bite"></i>
              </div>
              <h3 className="text-xl font-bold text-[#4A2B50] mb-3">Alfajores Clásicos</h3>
              <p className="text-slate-600">Galletas que se deshacen en la boca, preparadas siguiendo la tradición familiar con el toque perfecto de dulce de leche.</p>
            </div>

            {/* 2. Tarjeta Línea Saludable (Keto / Sin Azúcar) */}
            <div className="bg-emerald-50/30 rounded-3xl p-8 border border-emerald-100 flex flex-col items-center text-center relative hover:shadow-md transition-shadow">
              <span className="absolute -top-4 bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-1 rounded-full border border-emerald-200">
                Sin Azúcar
              </span>
              <div className="w-24 h-24 mb-6 bg-emerald-100 rounded-full flex items-center justify-center text-4xl text-emerald-600 shadow-inner">
                <i className="fa-solid fa-leaf"></i>
              </div>
              <h3 className="text-xl font-bold text-[#4A2B50] mb-3">Línea Saludable</h3>
              <p className="text-slate-600">Pan de caja artesanal y donas keto. Opciones deliciosas, seguras y libres de azúcar, ideales para dietas especiales o personas con diabetes.</p>
            </div>

            {/* 3. Tarjeta Roscas y Temporada */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center text-center relative hover:shadow-md transition-shadow">
              <span className="absolute -top-4 bg-amber-100 text-amber-800 text-xs font-bold px-4 py-1 rounded-full border border-amber-200">
                ¡Próximamente!
              </span>
              <div className="w-24 h-24 mb-6 bg-[#F5EEFD] rounded-full flex items-center justify-center text-4xl text-[#4A2B50] shadow-inner">
                <i className="fa-solid fa-crown"></i>
              </div>
              <h3 className="text-xl font-bold text-[#4A2B50] mb-3">Ediciones de Temporada</h3>
              <p className="text-slate-600">Roscas tradicionales con figuras temáticas de diseño exclusivo escondidas en su interior, y nuestro esperado Pan de Muerto.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Inicio;

