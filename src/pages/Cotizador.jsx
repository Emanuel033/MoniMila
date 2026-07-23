import React, { useState } from 'react';

function Cotizador() {
  const [nombreProducto, setNombreProducto] = useState('');
  const [piezasProducidas, setPiezasProducidas] = useState(12); // Ej: Cuántos alfajores salen en un lote
  const [materiales, setMateriales] = useState([
    { id: 1, nombre: 'Harina / Secos', costo: 40 },
    { id: 2, nombre: 'Dulce de Leche / Relleno', costo: 80 },
    { id: 3, nombre: 'Empaque y Etiquetas', costo: 25 }
  ]);
  
  const [nuevoMaterial, setNuevoMaterial] = useState('');
  const [nuevoCosto, setNuevoCosto] = useState('');
  const [margenGanancia, setMargenGanancia] = useState(50); // Porcentaje de ganancia deseada (%)

  // Agregar nuevo material o ingrediente
  const agregarMaterial = (e) => {
    e.preventDefault();
    if (!nuevoMaterial || !nuevoCosto) return;
    setMateriales([
      ...materiales,
      { id: Date.now(), nombre: nuevoMaterial, costo: parseFloat(nuevoCosto) || 0 }
    ]);
    setNuevoMaterial('');
    setNuevoCosto('');
  };

  // Eliminar material
  const eliminarMaterial = (id) => {
    setMateriales(materiales.filter(item => item.id !== id));
  };

  // Cálculos matemáticos
  const costoTotalInsumos = materiales.reduce((total, item) => total + item.costo, 0);
  const costoPorPieza = piezasProducidas > 0 ? costoTotalInsumos / piezasProducidas : 0;
  const gananciaPorPieza = costoPorPieza * (margenGanancia / 100);
  const precioSugeridoVenta = costoPorPieza + gananciaPorPieza;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="text-xs font-bold tracking-widest text-[#4A2B50] uppercase bg-[#F5EEFD] px-4 py-1.5 rounded-full">
          Herramienta Interna
        </span>
        <h2 className="text-4xl font-serif font-bold text-[#4A2B50] mt-3 mb-2">Calculadora de Costos y Precios</h2>
        <p className="text-slate-600">Calcula tus gastos en materiales, costos de producción y define tu precio de venta ideal.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Columna Izquierda: Ingresos de Datos (Materiales y Lote) */}
        <div className="space-y-6">
          
          {/* Datos del Producto */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#4A2B50]">1. Datos del Lote</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Producto / Lote</label>
              <input 
                type="text" 
                placeholder="Ej. Docena de Alfajores Clásicos"
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-[#4A2B50]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Piezas que salen en total</label>
              <input 
                type="number" 
                min="1"
                value={piezasProducidas}
                onChange={(e) => setPiezasProducidas(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-[#4A2B50]"
              />
            </div>
          </div>

          {/* Lista de Materiales / Gastos */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#4A2B50]">2. Costos de Materiales e Insumos</h3>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {materiales.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-xl text-sm">
                  <span className="font-medium text-slate-700">{item.nombre}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#4A2B50]">${item.costo.toFixed(2)}</span>
                    <button 
                      onClick={() => eliminarMaterial(item.id)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulario para agregar nuevo material */}
            <form onSubmit={agregarMaterial} className="pt-2 border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                placeholder="Material o Ingrediente"
                value={nuevoMaterial}
                onChange={(e) => setNuevoMaterial(e.target.value)}
                className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#4A2B50]"
              />
              <input 
                type="number" 
                placeholder="Costo ($)"
                value={nuevoCosto}
                onChange={(e) => setNuevoCosto(e.target.value)}
                className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#4A2B50]"
              />
              <button 
                type="submit"
                className="bg-[#4A2B50] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-opacity-90"
              >
                +
              </button>
            </form>
          </div>

          {/* Margen de Ganancia */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-[#4A2B50]">3. Margen de Ganancia Deseado</h3>
              <span className="bg-[#F5EEFD] text-[#4A2B50] font-bold px-3 py-1 rounded-full text-sm">{margenGanancia}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="200" 
              step="5"
              value={margenGanancia}
              onChange={(e) => setMargenGanancia(parseInt(e.target.value))}
              className="w-full accent-[#4A2B50] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>10% (Bajo)</span>
              <span>100% (Doble)</span>
              <span>200% (Alto)</span>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Resultados y Desglose Financiero */}
        <div className="bg-[#4A2B50] rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <i className="fa-solid fa-chart-pie text-9xl"></i>
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-[#E8D8F8] font-bold">Resumen Financiero</span>
            <h3 className="text-2xl font-serif font-bold mt-1 mb-6">{nombreProducto || 'Tu Producto'}</h3>

            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <p className="text-xs text-[#E8D8F8] opacity-80">Costo total de insumos del lote</p>
                <p className="text-3xl font-bold font-serif">${costoTotalInsumos.toFixed(2)} <span className="text-xs font-normal">MXN</span></p>
              </div>

              <div className="border-b border-white/10 pb-4">
                <p className="text-xs text-[#E8D8F8] opacity-80">Costo real de producción por cada pieza</p>
                <p className="text-3xl font-bold font-serif">${costoPorPieza.toFixed(2)} <span className="text-xs font-normal">MXN</span></p>
              </div>

              <div className="bg-white/10 p-5 rounded-2xl">
                <p className="text-xs text-[#E8D8F8] font-bold uppercase mb-1">Precio sugerido de venta por pieza</p>
                <p className="text-4xl font-bold font-serif text-[#E8D8F8]">${precioSugeridoVenta.toFixed(2)} <span className="text-sm font-normal">MXN</span></p>
                <p className="text-[11px] text-[#E8D8F8] opacity-70 mt-2">
                  *Incluye tus materiales y tu ganancia del {margenGanancia}%.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-[#E8D8F8] opacity-60">
            Calculadora de costos interna de MoniMila Bakery
          </div>

        </div>

      </div>
    </div>
  );
}

export default Cotizador;
