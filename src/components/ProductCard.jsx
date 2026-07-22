import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function ProductCard({ product }) {
  const { agregarAlCarrito } = useApp();
  const [zoomOpen, setZoomOpen] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  const handleAdd = () => {
    agregarAlCarrito(product, cantidad);
    setCantidad(1); // Reinicia el contador tras agregar
  };

  return (
    <>
      {/* LIGHTBOX (Vista Ampliada) */}
      {zoomOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setZoomOpen(false)}>
          <div className="relative max-w-sm w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-[#F5EEFD] bg-white">
              <h3 className="font-bold font-serif text-[#4A2B50] text-lg truncate pr-4">{product.name}</h3>
              <button onClick={() => setZoomOpen(false)} className="w-8 h-8 bg-[#F5EEFD] hover:bg-[#E8D8F8] rounded-full flex items-center justify-center text-[#4A2B50] transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-8 flex justify-center bg-white cursor-zoom-out" onClick={() => setZoomOpen(false)}>
              <img src={product.image} alt={product.name} className="w-full max-h-[40vh] object-cover rounded-xl shadow-sm" onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Postre'} />
            </div>
            
            <div className="p-6 border-t border-[#F5EEFD] bg-white">
               <div className="flex justify-between items-center mb-4">
                 <span className="text-[10px] font-black text-[#4A2B50] uppercase tracking-widest bg-[#F5EEFD] px-3 py-1 rounded-full">{product.category}</span>
                 <span className="text-xl font-black text-[#4A2B50]">${product.precio} MXN</span>
               </div>
               {product.descripcion && (
                 <p className="text-sm text-slate-600 mb-6 italic">{product.descripcion}</p>
               )}
               <button onClick={() => { handleAdd(); setZoomOpen(false); }} className="w-full bg-[#4A2B50] hover:bg-opacity-90 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
                 <i className="fas fa-basket-shopping"></i> Agregar al Pedido
               </button>
            </div>
          </div>
        </div>
      )}

      {/* TARJETA NORMAL */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-[#F5EEFD] flex flex-col relative group transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        
        <div className="relative aspect-square w-full p-4 cursor-zoom-in overflow-hidden bg-white flex items-center justify-center" onClick={() => setZoomOpen(true)}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
            onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Postre'}
          />
        </div>

        <div className="p-4 flex flex-col flex-1 bg-white border-t border-[#F5EEFD]/50">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1">{product.category}</span>
          <h3 className="font-bold font-serif text-[14px] text-[#4A2B50] mb-1 leading-snug line-clamp-2">{product.name}</h3>
          <p className="text-[#4A2B50] font-black text-sm mb-4">${product.precio} MXN</p>
          
          <div className="flex items-center gap-2 mt-auto">
            <div className="flex items-center bg-[#F5EEFD] rounded-lg px-2 py-1">
              <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="px-2 text-slate-500 font-bold hover:text-[#4A2B50]">-</button>
              <span className="w-6 text-center text-xs font-bold text-[#4A2B50]">{cantidad}</span>
              <button onClick={() => setCantidad(cantidad + 1)} className="px-2 text-slate-500 font-bold hover:text-[#4A2B50]">+</button>
            </div>
            <button onClick={handleAdd} className="flex-1 bg-[#4A2B50] hover:bg-opacity-90 text-white py-2 rounded-lg font-semibold text-xs shadow-sm transition-all active:scale-95">
              Agregar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductCard;
