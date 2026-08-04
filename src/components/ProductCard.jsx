import React from 'react';

function ProductCard({ producto }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      
      {/* Contenedor de la Imagen */}
      <div className="h-64 bg-slate-100 relative overflow-hidden group">
        <img 
          src={producto.imagen} 
          alt={producto.nombre} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        
        {/* Etiquetas flotantes */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {producto.categoria && (
            <span className="bg-[#4A2B50]/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
              {producto.categoria}
            </span>
          )}
        </div>
        
        {producto.subcategoria && (
          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#4A2B50] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase">
            {producto.subcategoria}
          </span>
        )}
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#4A2B50] mb-2 leading-tight">
            {producto.nombre}
          </h3>
          <p className="text-slate-500 text-sm mb-4 line-clamp-2">
            {producto.descripcion}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
          <span className="text-2xl font-black text-emerald-600">
            ${producto.precio}
          </span>
          
          <button className="bg-[#4A2B50] hover:bg-opacity-90 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95">
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>

    </div>
  );
}

export default ProductCard;
