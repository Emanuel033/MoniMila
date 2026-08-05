import React, { useState } from 'react';
import { useApp } from '../context/AppContext'; // Asegúrate de que la ruta sea correcta

function ProductCard({ producto }) {
  // Traemos la función de tu contexto
  const { agregarAlCarrito } = useApp();
  
  // Estado para controlar si la ventana (Modal) está abierta o cerrada
  const [modalAbierto, setModalAbierto] = useState(false);

  // Función para agregar y cerrar el modal (si lo agregan desde adentro)
  const manejarAgregarCarrito = () => {
    agregarAlCarrito(producto);
    setModalAbierto(false); // Opcional: cierra el modal al agregar, o puedes dejarlo abierto
  };

  return (
    <>
      {/* ==========================================
          LA TARJETA NORMAL (EN EL CATÁLOGO)
          ========================================== */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        
        {/* Contenedor de la Imagen (Ahora es clickeable) */}
        <div 
          className="h-64 bg-slate-100 relative overflow-hidden group cursor-pointer"
          onClick={() => setModalAbierto(true)}
        >
          <img 
            src={producto.imagen} 
            alt={producto.nombre} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          
          {/* Capa oscura que aparece al pasar el mouse para indicar que se puede hacer clic */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <i className="fa-solid fa-magnifying-glass-plus text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 duration-300"></i>
          </div>
          
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
            <h3 
              className="text-xl font-bold text-[#4A2B50] mb-2 leading-tight cursor-pointer hover:underline"
              onClick={() => setModalAbierto(true)}
            >
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
            
            {/* AQUÍ CONECTAMOS EL CARRITO */}
            <button 
              onClick={() => agregarAlCarrito(producto)}
              className="bg-[#4A2B50] hover:bg-[#5b3663] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          EL MODAL (VENTANA EMERGENTE DE DETALLES)
          ========================================== */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Fondo oscuro (Cierra el modal al hacer clic afuera) */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setModalAbierto(false)}
          ></div>
          
          {/* Contenedor del Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row transform transition-all animate-fade-in-up">
            
            {/* Botón de cerrar (X) */}
            <button 
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur text-slate-800 rounded-full flex items-center justify-center hover:bg-[#4A2B50] hover:text-white transition-colors shadow-sm"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            {/* Imagen grande en el modal */}
            <div className="w-full md:w-1/2 bg-slate-100 relative min-h-[300px]">
              <img 
                src={producto.imagen} 
                alt={producto.nombre} 
                className="w-full h-full object-cover absolute inset-0"
              />
            </div>

            {/* Info completa en el modal */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between bg-white">
              <div>
                <div className="flex gap-2 mb-4">
                  <span className="bg-[#F5EEFD] text-[#4A2B50] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {producto.categoria}
                  </span>
                  {producto.subcategoria && (
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {producto.subcategoria}
                    </span>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A2B50] mb-4">
                  {producto.nombre}
                </h2>
                
                <span className="text-3xl font-black text-emerald-600 block mb-6">
                  ${producto.precio}
                </span>
                
                <div className="prose prose-sm text-slate-600 mb-8 whitespace-pre-wrap">
                  {/* Aquí mostramos la descripción completa sin cortarla */}
                  <p className="leading-relaxed">{producto.descripcion}</p>
                </div>
              </div>

              {/* Botón grande de agregar */}
              <div className="pt-6 border-t border-slate-100">
                <button 
                  onClick={manejarAgregarCarrito}
                  className="w-full bg-[#4A2B50] hover:bg-[#5b3663] text-white text-lg font-bold py-4 px-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-cart-plus"></i> Agregar al carrito
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
