import React, { useState } from 'react';

function Cotizador() {
  const [nombreProducto, setNombreProducto] = useState('Docena de Alfajores');
  const [piezasProducidas, setPiezasProducidas] = useState(12); 
  const [materiales, setMateriales] = useState([
    { id: 1, nombre: 'Harina y Secos', costo: 40 },
    { id: 2, nombre: 'Dulce de Leche', costo: 80 },
    { id: 3, nombre: 'Empaque', costo: 25 }
  ]);
  
  const [nuevoMaterial, setNuevoMaterial] = useState('');
  const [nuevoCosto, setNuevoCosto] = useState('');
  const [margenGanancia, setMargenGanancia] = useState(50); // % de ganancia

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

  const eliminarMaterial = (id) => {
    setMateriales(materiales.filter(item => item.id !== id));
  };

  // Fórmulas matemáticas
  const costoTotalInsumos = materiales.reduce((total, item) => total + item.costo, 0);
  const piezasValidas = piezasProducidas > 0 ? piezasProducidas : 1;
  
  const costoPorPieza = costoTotalInsumos / piezasValidas;
  const gananciaPorPieza = costoPorPieza * (margenGanancia / 100);
  
  const precioPieza = costoPorPieza + gananciaPorPieza;
  const precioMediaDocena = precioPieza * 6;
  const precioDocena = precioPieza * 12;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="text-xs font-bold tracking-widest text-[#4A2B50] uppercase bg-[#F5EEFD] px-4 py-1.5 rounded-full">
          Herramienta Interna
        </span>
        <h2 className="text-4xl font-serif font-bold text-[#4A2B50] mt-3 mb-2">Calculadora de Costos y Presentaciones</h2>
        <p className="text-slate-600">Calcula el costo real y descubre el precio sugerido por pieza, media docena y docena.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Columna Izquierda: Entradas y Fórmulas */}
        <div className="space-y-6">
          
          {/* 1. Datos del Lote */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#4A2B50]">1. Producción del Lote</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Producto</label>
              <input 
                type="text" 
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-[#4A2B50]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Piezas totales que salen de este lote</label>
              <input 
                type="number" 
                min="1"
                value={piezasProducidas}
                onChange={(e) => setPiezasProducidas(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-[#4A2B50]"
              />
            </div>
            {/* Explicación de la fórmula */}
            <div className="bg-[#F5EEFD]/50 p-3 rounded-xl text-xs text-[#4A2B50]">
              <span className="font-bold">Fórmula de Costo Unitario:</span> <br/>
              [Costo Total de Insumos] ÷ [Piezas Producidas] = Costo por Pieza.
            </div>
          </div>

          {/* 2. Materiales */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#4A2B50]">2. Materia Prima e Insumos</h3>
            
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {materiales.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-xl text-sm">
                  <span className="font-medium text-slate-700">{item.nombre}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#4A2B50]">${item.costo.toFixed(2)}</span>
                    <button onClick={() => eliminarMaterial(item.id)} className="text-red-400 hover:text-red-600 text-xs">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={agregarMaterial} className="pt-2 border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                placeholder="Ingrediente o material"
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
              <button type="submit" className="bg-[#4A2B50] text-white px-4 py-2 rounded-xl text-xs font-bold">+</button>
            </form>
            <div className="bg-[#F5EEFD]/50 p-3 rounded-xl text-xs text-[#4A2B50]">
              <span className="font-bold">Fórmula de Insumos:</span> <br/>
              Suma de todos los materiales utilizados para este lote = Costo Total.
            </div>
          </div>

          {/* 3. Ganancia */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-[#4A2B50]">3. Margen de Ganancia</h3>
              <span className="bg-[#F5EEFD] text-[#4A2B50] font-bold px-3 py-1 rounded-full text-sm">{margenGanancia}%</span>
            </div>
            <input 
              type="range" min="10" max="200" step="5"
              value={margenGanancia}
              onChange={(e) => setMargenGanancia(parseInt(e.target.value))}
              className="w-full accent-[#4A2B50] cursor-pointer"
            />
            <div className="bg-[#F5EEFD]/50 p-3 rounded-xl text-xs text-[#4A2B50]">
              <span className="font-bold">Fórmula de Precio Sugerido:</span> <br/>
              [Costo por Pieza] + ([Costo por Pieza] × {margenGanancia}%) = Precio de Venta.
            </div>
          </div>

        </div>

        {/* Columna Derecha: Resultados por Presentación */}
        <div className="bg-[#4A2B50] rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#E8D8F8] font-bold">Desglose por Presentación</span>
            <h3 className="text-2xl font-serif font-bold mt-1 mb-6">{nombreProducto}</h3>

            <div className="space-y-4">
              {/* Individual */}
              <div className="bg-white/10 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-xs text-[#E8D8F8]">Precio por Pieza (Individual)</p>
                  <p className="text-xs opacity-60">Costo real: ${costoPorPieza.toFixed(2)}</p>
                </div>
                <p className="text-2xl font-bold font-serif">${precioPieza.toFixed(2)}</p>
              </div>

              {/* Media Docena */}
              <div className="bg-white/10 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-xs text-[#E8D8F8]">Media Docena (6 piezas)</p>
                  <p className="text-xs opacity-60">Precio unitario × 6</p>
                </div>
                <p className="text-2xl font-bold font-serif">${precioMediaDocena.toFixed(2)}</p>
              </div>

              {/* Docena */}
              <div className="bg-white/10 p-4 rounded-2xl flex justify-between items-center border border-[#E8D8F8]/30">
                <div>
                  <p className="text-xs text-[#E8D8F8] font-bold">Docena Completa (12 piezas)</p>
                  <p className="text-xs opacity-60">Precio unitario × 12</p>
                </div>
                <p className="text-3xl font-bold font-serif text-[#E8D8F8]">${precioDocena.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-[#E8D8F8] opacity-70">
            Insumos del lote: ${costoTotalInsumos.toFixed(2)} | Margen aplicado: {margenGanancia}%
          </div>
        </div>

      </div>
    </div>
  );
}

export data export default Cotizador;
