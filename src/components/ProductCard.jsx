import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

function ProductCard({ producto }) {
  const { agregarAlCarrito } = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);

  // Lista de presentaciones (si no tiene, por defecto usa la única)
  const presentaciones = producto.presentaciones && producto.presentaciones.length > 0 
    ? producto.presentaciones 
    : [{ nombre: 'Pieza única', precio: producto.precio, cantidadPiezas: 1 }];

  // Estado para la presentación seleccionada (empieza en la primera opción)
  const [presSeleccionada, setPresSeleccionada] = useState(presentaciones[0]);

  // Actualizar si cambian las presentaciones del producto
  useEffect(() => {
    if (presentaciones.length > 0) {
      setPresSeleccionada(presentaciones[0]);
    }
  }, [producto]);

  const manejarAgregarCarrito = () => {
    // Creamos un objeto que incluye la presentación elegida y su precio final
    const productoConPresentacion = {
      ...producto,
      precio: presSeleccionada.precio,
      presentacionElegida: presSeleccionada.nombre,
      cantidadPiezas: presSeleccionada.cantidadPiezas || 1
    };

    agregarAlCarrito(productoConPresentacion);
    setModalAbierto(false);
  };

  return (
    <>
      {/* TARJETA EN EL CATÁLOGO */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        
        <div 
          className="h-64 bg-slate-100 relative overflow-hidden group cursor-pointer"
          onClick={() => setModalAbierto(true)}
        >
          <img 
            src={producto.imagen} 
            alt={producto.nombre} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <i className="fa-solid fa-magnifying-glass-plus text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 duration-300"></i>
          </div>
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {producto.categoria && (
              <span className="bg-[#4A2B50]/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                {producto.categoria}
              </span>
            )}
          </div>
        </div>

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
            <div>
              <span className="text-xs text-slate-400 block font-bold">Desde</span>
              <span className="text-2xl font-black text-emerald-600">
                ${producto.precio}
              </span>
            </div>
            
            <button 
              onClick={() => setModalAbierto(true)}
              className="bg-[#4A2B50] hover:bg-[#5b3663] text-white px-4 py-2.5 rounded-2xl shadow-md transition-transform active:scale-95 text-sm font-bold flex items-center gap-2"
            >
              <i className="fa-solid fa-eye"></i> Ver opciones
            </button>
          </div>
        </div>
      </div>

      {/* VENTANA EMERGENTE (MODAL CON SELECTOR DE PRESENTACIONES) */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setModalAbierto(false)}></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row transform transition-all">
            
            <button 
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur text-slate-800 rounded-full flex items-center justify-center hover:bg-[#4A2B50] hover:text-white transition-colors shadow-sm"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="w-full md:w-1/2 bg-slate-100 relative min-h-[300px]">
              <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover absolute inset-0" />
            </div>

            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between bg-white">
              <div>
                <div className="flex gap-2 mb-4">
                  <span className="bg-[#F5EEFD] text-[#4A2B50] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {producto.categoria}
                  </span>
                </div>

                <h2 className="text-3xl font-serif font-bold text-[#4A2B50] mb-2">
                  {producto.nombre}
                </h2>
                
                {/* PRECIO DINÁMICO SEGÚN LA PRESENTACIÓN ELEGIDA */}
                <span className="text-3xl font-black text-emerald-600 block mb-4">
                  ${presSeleccionada ? presSeleccionada.precio : producto.precio}
                </span>

                <div className="prose prose-sm text-slate-600 mb-6 whitespace-pre-wrap">
                  <p className="leading-relaxed">{producto.descripcion}</p>
                </div>

                {/* SELECTOR DE PRESENTACIONES (1 pz, 6 pz, 9 pz, 12 pz) */}
                <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-[#4A2B50] uppercase mb-2">Elige tu presentación:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {presentaciones.map((pres, idx) => {
                      const esSeleccionada = presSeleccionada.nombre === pres.nombre;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPresSeleccionada(pres)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center ${
                            esSeleccionada 
                              ? 'bg-[#4A2B50] text-white border-[#4A2B50] shadow-md' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{pres.nombre}</span>
                          <span className={`text-sm font-black mt-0.5 ${esSeleccionada ? 'text-emerald-300' : 'text-emerald-600'}`}>
                            ${pres.precio}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={manejarAgregarCarrito}
                  className="w-full bg-[#4A2B50] hover:bg-[#5b3663] text-white text-lg font-bold py-4 px-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-cart-plus"></i> Agregar {presSeleccionada?.nombre} al carrito
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
