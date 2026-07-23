import React, { useState } from 'react';

function Cotizador() {
  const [producto, setProducto] = useState('alfajores');
  const [cantidad, setCantidad] = useState(1);
  const [incluyeFigura, setIncluyeFigura] = useState(false);

  // Puedes ajustar estos precios directamente aquí
  const preciosBase = {
    alfajores: 35, // Precio por alfajor
    rosca_chica: 250, // Precio por rosca
    rosca_grande: 450
  };
  const costoFiguraExtra = 60; // Costo por añadir figura temática personalizada

  // Lógica de cálculo
  const calcularTotal = () => {
    let subtotal = preciosBase[producto] * cantidad;
    let costoExtras = incluyeFigura ? (costoFiguraExtra * cantidad) : 0;
    
    // Si son alfajores por docena, podrías aplicar un descuento aquí si quisieras
    return subtotal + costoExtras;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-serif font-bold text-[#4A2B50] mb-4">Cotizador de Pedidos</h2>
        <p className="text-slate-600">Calcula el presupuesto para tus eventos o pedidos especiales.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Controles de la Calculadora */}
          <div className="space-y-6">
            
            {/* Selección de Producto */}
            <div>
              <label className="block text-sm font-bold text-[#4A2B50] mb-2">Tipo de Producto</label>
              <select 
                value={producto} 
                onChange={(e) => setProducto(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-[#4A2B50] focus:ring-1 focus:ring-[#4A2B50]"
              >
                <option value="alfajores">Alfajores Clásicos (Pieza)</option>
                <option value="rosca_chica">Rosca de Temporada (Chica)</option>
                <option value="rosca_grande">Rosca de Temporada (Grande)</option>
              </select>
            </div>

            {/* Selección de Cantidad */}
            <div>
              <label className="block text-sm font-bold text-[#4A2B50] mb-2">Cantidad</label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="w-12 h-12 rounded-full bg-[#F5EEFD] text-[#4A2B50] font-bold text-xl hover:bg-[#E8D8F8] transition-colors"
                >-</button>
                <span className="text-2xl font-bold text-slate-700 w-12 text-center">{cantidad}</span>
                <button 
                  onClick={() => setCantidad(cantidad + 1)}
                  className="w-12 h-12 rounded-full bg-[#F5EEFD] text-[#4A2B50] font-bold text-xl hover:bg-[#E8D8F8] transition-colors"
                >+</button>
              </div>
            </div>

            {/* Opción de Figura Personalizada */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={incluyeFigura}
                    onChange={(e) => setIncluyeFigura(e.target.checked)}
                    className="w-6 h-6 border-2 border-slate-300 rounded-md appearance-none checked:bg-[#4A2B50] checked:border-[#4A2B50] transition-colors"
                  />
                  <i className={`fa-solid fa-check absolute left-1 text-white text-sm pointer-events-none transition-opacity ${incluyeFigura ? 'opacity-100' : 'opacity-0'}`}></i>
                </div>
                <div>
                  <p className="font-bold text-[#4A2B50]">Incluir Sorpresa Temática</p>
                  <p className="text-xs text-slate-500">Añade figuras de diseño exclusivo al interior (+${costoFiguraExtra})</p>
                </div>
              </label>
            </div>

          </div>

          {/* Tarjeta de Resultado Total */}
          <div className="bg-[#4A2B50] rounded-2xl p-8 text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <i className="fa-solid fa-calculator text-8xl"></i>
            </div>
            
            <h3 className="text-xl font-medium text-[#E8D8F8] mb-2 relative z-10">Total Estimado</h3>
            <div className="text-5xl font-bold font-serif mb-6 relative z-10">
              ${calcularTotal()} <span className="text-lg font-normal">MXN</span>
            </div>
            
            <p className="text-sm text-[#E8D8F8] opacity-80 mb-8 relative z-10">
              *Los precios no incluyen costo de envío. El envío a domicilio se cotizará al confirmar tu pedido.
            </p>
            
            <button className="w-full bg-white text-[#4A2B50] hover:bg-[#F5EEFD] font-bold py-4 rounded-xl transition-colors relative z-10 shadow-lg flex items-center justify-center gap-2">
              <i className="fa-brands fa-whatsapp text-xl"></i> Enviar por WhatsApp
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cotizador;
