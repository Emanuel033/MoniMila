import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, updateDoc } from 'firebase/firestore';

const PESOS_MX = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

function Produccion() {
  // Datos de productos e ingredientes
  const [productosDB, setProductosDB] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [ventas, setVentas] = useState([]);
  
  // Formulario Nuevo Lote
  const [prodSeleccionado, setProdSeleccionado] = useState('');
  const [cantidadProducida, setCantidadProducida] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fechaProduccion, setFechaProduccion] = useState(new Date().toISOString().split('T')[0]);

  // Formulario Registrar Venta
  const [loteSeleccionado, setLoteSeleccionado] = useState('');
  const [cantidadVenta, setCantidadVenta] = useState('');
  const [fechaVenta, setFechaVenta] = useState(new Date().toISOString().split('T')[0]);

  // Cargar datos
  useEffect(() => {
    const unsubProd = onSnapshot(collection(db, "productos"), (snap) => {
      setProductosDB(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubLotes = onSnapshot(query(collection(db, "lotes"), orderBy('fecha', 'desc')), (snap) => {
      setLotes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubVentas = onSnapshot(query(collection(db, "ventas"), orderBy('fecha', 'desc')), (snap) => {
      setVentas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubProd(); unsubLotes(); unsubVentas(); };
  }, []);

  // =============================================================
  // 🧾 REGISTRAR NUEVO LOTE PRODUCIDO
  // =============================================================
  const registrarLote = async (e) => {
    e.preventDefault();
    if (!prodSeleccionado || !cantidadProducida) return;

    const prod = productosDB.find(p => p.id === prodSeleccionado);
    if (!prod) return;

    const cant = parseInt(cantidadProducida);
    const costoPorPieza = prod.costoRealProduccion || 0;
    const costoTotalLote = cant * costoPorPieza;
    const precioVenta = prod.precioSugerido || 0;
    
    // Punto de equilibrio: cuántas hay que vender para recuperar TODO
    const puntoEquilibrio = precioVenta > 0 ? Math.ceil(costoTotalLote / precioVenta) : cant;

    try {
      await addDoc(collection(db, "lotes"), {
        productoId: prodSeleccionado,
        nombreProducto: prod.nombre,
        cantidadProducida: cant,
        cantidadDisponible: cant,
        costoPorPieza,
        costoTotalLote,
        precioVenta,
        puntoEquilibrio,
        observaciones,
        fecha: fechaProduccion,
        fechaCreacion: new Date()
      });
      
      setProdSeleccionado('');
      setCantidadProducida('');
      setObservaciones('');
      alert(`✅ Lote registrado!\nCosto total: ${PESOS_MX.format(costoTotalLote)}\nPunto de equilibrio: ${puntoEquilibrio} piezas`);
    } catch (err) {
      console.error(err);
      alert("Error al registrar lote");
    }
  };

  // =============================================================
  // 💰 REGISTRAR VENTA
  // =============================================================
  const registrarVenta = async (e) => {
    e.preventDefault();
    if (!loteSeleccionado || !cantidadVenta) return;

    const lote = lotes.find(l => l.id === loteSeleccionado);
    if (!lote) return;

    const cant = parseInt(cantidadVenta);
    if (cant > lote.cantidadDisponible) {
      alert(`⚠️ Solo tienes ${lote.cantidadDisponible} disponibles de este lote`);
      return;
    }

    const montoTotal = cant * lote.precioVenta;
    const costoRecuperado = cant * lote.costoPorPieza;
    const ganancia = montoTotal - costoRecuperado;

    try {
      // 1. Guardar venta
      await addDoc(collection(db, "ventas"), {
        loteId: loteSeleccionado,
        nombreProducto: lote.nombreProducto,
        cantidad: cant,
        precioUnitario: lote.precioVenta,
        montoTotal,
        costoRecuperado,
        ganancia,
        fecha: fechaVenta,
        fechaCreacion: new Date()
      });

      // 2. Actualizar disponibles en el lote
      await updateDoc(doc(db, "lotes", loteSeleccionado), {
        cantidadDisponible: lote.cantidadDisponible - cant
      });

      setCantidadVenta('');
      alert(`✅ Venta registrada!\nEntraron: ${PESOS_MX.format(montoTotal)}\nGuardar para reposición: ${PESOS_MX.format(costoRecuperado)}\nGanancia disponible: ${PESOS_MX.format(ganancia)}`);
    } catch (err) {
      console.error(err);
      alert("Error al registrar venta");
    }
  };

  // =============================================================
  // 📊 Calcular resumen general
  // =============================================================
  const resumen = {
    totalLotes: lotes.length,
    totalProducido: lotes.reduce((s, l) => s + l.cantidadProducida, 0),
    costoTotalInvertido: lotes.reduce((s, l) => s + l.costoTotalLote, 0),
    vendidoDinero: ventas.reduce((s, v) => s + v.montoTotal, 0),
    recuperado: ventas.reduce((s, v) => s + v.costoRecuperado, 0),
    gananciaTotal: ventas.reduce((s, v) => s + v.ganancia, 0),
    disponibles: lotes.reduce((s, l) => s + l.cantidadDisponible, 0)
  };

  // =============================================================
  // Eliminar lote
  // =============================================================
  const eliminarLote = async (id) => {
    if (window.confirm("¿Eliminar este lote? No se borran las ventas registradas")) {
      await deleteDoc(doc(db, "lotes", id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <span className="text-xs font-bold tracking-widest text-[#4A2B50] uppercase bg-[#F5EEFD] px-4 py-1.5 rounded-full">Herramienta de Gestión</span>
        <h2 className="text-3xl font-serif font-bold text-[#4A2B50] mt-3">Producción y Rentabilidad</h2>
        <p className="text-slate-500 mt-2 text-sm">Sabe cuánto gastas, cuándo recuperas tu dinero y cuánto ganas de verdad</p>
      </div>

      {/* 📈 RESUMEN GENERAL */}
      <div className="grid md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">💰 Invertido</p>
          <p className="text-lg font-bold text-slate-700">{PESOS_MX.format(resumen.costoTotalInvertido)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">💵 Vendido</p>
          <p className="text-lg font-bold text-blue-600">{PESOS_MX.format(resumen.vendidoDinero)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">🔄 Recuperado</p>
          <p className="text-lg font-bold text-amber-600">{PESOS_MX.format(resumen.recuperado)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">✨ Ganancia</p>
          <p className="text-lg font-bold text-emerald-600">{PESOS_MX.format(resumen.gananciaTotal)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">📦 Disponibles</p>
          <p className="text-lg font-bold text-[#4A2B50]">{resumen.disponibles}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">📊 Lotes</p>
          <p className="text-lg font-bold">{resumen.totalLotes}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* 🧾 Columna Izquierda: Registrar Lote */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-[#4A2B50] mb-4">
              <i className="fa-solid fa-kitchen-set mr-2 text-emerald-500"></i> Registrar Lote Producido
            </h3>
            <form onSubmit={registrarLote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Producto</label>
                <select 
                  value={prodSeleccionado} 
                  onChange={(e) => setProdSeleccionado(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                  required
                >
                  <option value="">Selecciona qué produjiste...</option>
                  {productosDB.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} — Costo: {PESOS_MX.format(p.costoRealProduccion || 0)}/pza
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cantidad producida</label>
                  <input 
                    type="number" min="1" 
                    value={cantidadProducida} 
                    onChange={(e) => setCantidadProducida(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                  <input 
                    type="date" 
                    value={fechaProduccion} 
                    onChange={(e) => setFechaProduccion(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>

              {prodSeleccionado && cantidadProducida && (() => {
                const prod = productosDB.find(p => p.id === prodSeleccionado);
                if (!prod) return null;
                const cant = parseInt(cantidadProducida);
                const costoTotal = cant * (prod.costoRealProduccion || 0);
                const precioVenta = prod.precioSugerido || prod.precio || 0;
                const puntoEq = precioVenta > 0 ? Math.ceil(costoTotal / precioVenta) : cant;
                return (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                    <p className="text-sm"><strong>Costo total del lote:</strong> {PESOS_MX.format(costoTotal)}</p>
                    <p className="text-sm"><strong>Precio venta sugerido:</strong> {PESOS_MX.format(precioVenta)}/pza</p>
                    <p className="text-sm font-bold text-amber-800">
                      🎯 Punto de equilibrio: Vender {puntoEq} piezas = ya recuperaste TODO
                    </p>
                    <p className="text-xs text-amber-600">
                      De la pieza {puntoEq + 1} en adelante, todo es ganancia 💸
                    </p>
                  </div>
                );
              })()}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notas (sobra, faltó, etc.)</label>
                <textarea 
                  value={observaciones} 
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ej: Sobró masa, faltó 50ml de leche..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                  rows={2}
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl"
              >
                ✅ Registrar Lote
              </button>
            </form>
          </div>

          {/* 💰 Registrar Venta */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-[#4A2B50] mb-4">
              <i className="fa-solid fa-cash-register mr-2 text-blue-500"></i> Registrar Venta
            </h3>
            <form onSubmit={registrarVenta} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">De qué lote</label>
                <select 
                  value={loteSeleccionado} 
                  onChange={(e) => setLoteSeleccionado(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                  required
                >
                  <option value="">Selecciona...</option>
                  {lotes.filter(l => l.cantidadDisponible > 0).map(l => (
                    <option key={l.id} value={l.id}>
                      {l.nombreProducto} — {l.cantidadDisponible} disponibles @ {PESOS_MX.format(l.precioVenta)}
                    </option>
                  ))}
                  {lotes.filter(l => l.cantidadDisponible > 0).length === 0 && (
                    <option disabled>⚠️ No hay lotes con productos disponibles</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cantidad vendida</label>
                  <input 
                    type="number" min="1" 
                    value={cantidadVenta} 
                    onChange={(e) => setCantidadVenta(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                  <input 
                    type="date" 
                    value={fechaVenta} 
                    onChange={(e) => setFechaVenta(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>

              {loteSeleccionado && cantidadVenta && (() => {
                const lote = lotes.find(l => l.id === loteSeleccionado);
                if (!lote) return null;
                const cant = parseInt(cantidadVenta);
                if (cant > lote.cantidadDisponible) {
                  return <p className="text-red-600 text-sm font-bold">⚠️ Solo hay {lote.cantidadDisponible} disponibles</p>;
                }
                const total = cant * lote.precioVenta;
                const recuperar = cant * lote.costoPorPieza;
                const ganancia = total - recuperar;
                return (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-1">
                    <p className="text-sm"><strong>Total a cobrar:</strong> {PESOS_MX.format(total)}</p>
                    <p className="text-sm text-amber-700">🔄 Guardar para reponer: {PESOS_MX.format(recuperar)}</p>
                    <p className="text-sm font-bold text-emerald-700">✨ Ganancia disponible: {PESOS_MX.format(ganancia)}</p>
                  </div>
                );
              })()}

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
              >
                💰 Registrar Venta
              </button>
            </form>
          </div>
        </div>

        {/* 📋 Columna Derecha: Historial */}
        <div className="lg:col-span-7 space-y-6">
          {/* Lotes Activos */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-[#4A2B50] mb-4">📋 Lotes de Producción</h3>
            {lotes.length === 0 ? (
              <p className="text-center py-8 text-slate-400">Aún no hay lotes registrados. Produce algo y regístralo arriba.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {lotes.map(lote => {
                  const vendidas = lote.cantidadProducida - lote.cantidadDisponible;
                  const progreso = lote.cantidadProducida > 0 
                    ? (vendidas / lote.cantidadProducida) * 100 
                    : 0;
                  const alcanzadoEquilibrio = vendidas >= lote.puntoEquilibrio;
                  return (
                    <div key={lote.id} className={`p-4 rounded-2xl border-2 ${
                      alcanzadoEquilibrio ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-lg">{lote.nombreProducto}</h4>
                          <p className="text-sm text-slate-500">
                            {lote.fecha} · {lote.cantidadProducida} producidas
                          </p>
                        </div>
                        <button 
                          onClick={() => eliminarLote(lote.id)}
                          className="text-slate-300 hover:text-red-500"
                          title="Eliminar lote"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-xs text-slate-500">Costo Total</p>
                          <p className="font-bold">{PESOS_MX.format(lote.costoTotalLote)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Punto Equilibrio</p>
                          <p className="font-bold">{lote.puntoEquilibrio} piezas</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Disponibles</p>
                          <p className={`font-bold ${lote.cantidadDisponible > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {lote.cantidadDisponible}
                          </p>
                        </div>
                      </div>

                      {/* Barra de progreso */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Vendidas: {vendidas}/{lote.cantidadProducida}</span>
                          <span className={alcanzadoEquilibrio ? 'font-bold text-emerald-600' : 'text-amber-600'}>
                            {alcanzadoEquilibrio ? '✅ Recuperaste tu inversión!' : `Faltan ${lote.puntoEquilibrio - vendidas} para recuperar`}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all ${alcanzadoEquilibrio ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(progreso, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {lote.observaciones && (
                        <p className="text-xs text-slate-500 bg-white p-2 rounded-lg">
                          📝 {lote.observaciones}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Historial de Ventas */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-[#4A2B50] mb-4">📊 Historial de Ventas</h3>
            {ventas.length === 0 ? (
              <p className="text-center py-4 text-slate-400">No hay ventas registradas aún.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="py-2 font-bold text-slate-500">Fecha</th>
                      <th className="py-2 font-bold text-slate-500">Producto</th>
                      <th className="py-2 font-bold text-slate-500 text-center">Cant</th>
                      <th className="py-2 font-bold text-slate-500 text-right">Total</th>
                      <th className="py-2 font-bold text-slate-500 text-right">Recuperado</th>
                      <th className="py-2 font-bold text-slate-500 text-right">Ganancia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map(v => (
                      <tr key={v.id} className="border-b border-slate-100">
                        <td className="py-2">{v.fecha}</td>
                        <td className="py-2">{v.nombreProducto}</td>
                        <td className="py-2 text-center">{v.cantidad}</td>
                        <td className="py-2 text-right font-bold">{PESOS_MX.format(v.montoTotal)}</td>
                        <td className="py-2 text-right text-amber-600">{PESOS_MX.format(v.costoRecuperado)}</td>
                        <td className="py-2 text-right text-emerald-600 font-bold">{PESOS_MX.format(v.ganancia)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Produccion;
