import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';

function Cotizador() {
  const [ingredientesDB, setIngredientesDB] = useState([]);
  const [productosDB, setProductosDB] = useState([]); 
  
  const [editandoIngId, setEditandoIngId] = useState(null);
  const [ingAnterior, setIngAnterior] = useState(null); // ← guarda datos antes de editar
  const [nuevoIngNombre, setNuevoIngNombre] = useState('');
  const [nuevoIngCosto, setNuevoIngCosto] = useState('');
  const [nuevoIngCantidad, setNuevoIngCantidad] = useState('');
  const [nuevoIngUnidad, setNuevoIngUnidad] = useState('g');

  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [piezasProducidas, setPiezasProducidas] = useState(1); 
  const [materialesReceta, setMaterialesReceta] = useState([]);
  const [margenGanancia, setMargenGanancia] = useState(50);
  const [presentaciones, setPresentaciones] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [alertaImpacto, setAlertaImpacto] = useState(null); // ← alerta de productos afectados

  const [recetaIngId, setRecetaIngId] = useState('');
  const [recetaCantidad, setRecetaCantidad] = useState('');
  const [recetaMedida, setRecetaMedida] = useState('unidad_base');

  const factorConversion = {
    unidad_base: 1, taza_liquido: 250, taza_harina: 120, 
    taza_azucar: 200, taza_avena: 90, cucharada: 15, cucharadita: 5 
  };

  // =============================================================
  // 🔄 CARGAR PRODUCTO SELECCIONADO
  // =============================================================
  useEffect(() => {
    if (!productoSeleccionadoId) {
      setNombreProducto('Selecciona un producto...');
      setPiezasProducidas(1);
      setMaterialesReceta([]);
      setMargenGanancia(50);
      setPresentaciones([]);
      return;
    }

    const producto = productosDB.find(p => p.id === productoSeleccionadoId);
    if (!producto) return;

    setNombreProducto(producto.nombre);
    setPiezasProducidas(producto.piezasPorLote || 1);
    setMargenGanancia(producto.margenGanancia || 50);
    setMaterialesReceta(producto.recetaIngredientes || []);
    
    if (producto.presentaciones && producto.presentaciones.length > 0) {
      setPresentaciones(producto.presentaciones.map((p, i) => ({
        id: Date.now() + i,
        cantidad: p.cantidadPiezas || 1,
        nombre: p.nombre || '',
        precioVenta: p.precio || ''
      })));
    } else {
      setPresentaciones([
        { id: 1, cantidad: 1, nombre: '1 Pieza', precioVenta: '' },
        { id: 2, cantidad: 6, nombre: '6 Piezas', precioVenta: '' },
        { id: 3, cantidad: 12, nombre: '12 Piezas', precioVenta: '' }
      ]);
    }
  }, [productoSeleccionadoId, productosDB]);

  // Cargar listas de Firestore
  useEffect(() => {
    const unsubIng = onSnapshot(collection(db, "ingredientes"), (snapshot) => {
      setIngredientesDB(snapshot.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => a.nombre.localeCompare(b.nombre)));
    });
    const unsubProd = onSnapshot(collection(db, "productos"), (snapshot) => {
      setProductosDB(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubIng(); unsubProd(); };
  }, []);

  // =============================================================
  // 🧮 RECALCULAR COSTO DINÁMICO
  // =============================================================
  const costoTotal = materialesReceta.reduce((sum, item) => {
    const ingActual = ingredientesDB.find(i => i.id === item.ingredienteId);
    if (!ingActual) return sum;
    return sum + (item.cantidadUnidadBase * ingActual.costoPorUnidadBase);
  }, 0);

  const costoPorPieza = piezasProducidas > 0 ? costoTotal / piezasProducidas : 0;
  const precioPieza = costoPorPieza * (1 + margenGanancia / 100);

  // =============================================================
  // 📊 CALCULAR IMPACTO AL CAMBIAR INGREDIENTE
  // =============================================================
  const calcularImpacto = (ingredienteId, costoAnterior, costoNuevo) => {
    if (costoAnterior === costoNuevo) return [];
    const diferenciaPorUnidad = costoNuevo - costoAnterior;
    const porcentajeCambio = ((costoNuevo - costoAnterior) / costoAnterior) * 100;

    return productosDB.filter(prod => 
      prod.recetaIngredientes?.some(item => item.ingredienteId === ingredienteId)
    ).map(prod => {
      const uso = prod.recetaIngredientes.find(item => item.ingredienteId === ingredienteId);
      const cantidadUsada = uso.cantidadUnidadBase;
      const impactoPorLote = cantidadUsada * diferenciaPorUnidad;
      const piezas = prod.piezasPorLote || 1;
      const impactoPorPieza = impactoPorLote / piezas;
      const costoAnteriorProd = prod.costoRealProduccion || 0;
      const costoNuevoProd = costoAnteriorProd + impactoPorPieza;

      return {
        nombre: prod.nombre,
        impactoPorPieza,
        costoAnterior: costoAnteriorProd,
        costoNuevo: costoNuevoProd,
        porcentajeCambio: costoAnteriorProd > 0 
          ? ((costoNuevoProd - costoAnteriorProd) / costoAnteriorProd) * 100 
          : 0
      };
    });
  };

  // =============================================================
  // 💾 GUARDAR INGREDIENTE CON ALERTA DE IMPACTO
  // =============================================================
  const guardarIngredienteDB = async (e) => {
    e.preventDefault();
    if (!nuevoIngNombre || !nuevoIngCosto || !nuevoIngCantidad) return;

    const costoNuevo = parseFloat(nuevoIngCosto) / parseFloat(nuevoIngCantidad);
    const datos = { 
      nombre: nuevoIngNombre, 
      costoCompra: parseFloat(nuevoIngCosto), 
      cantidadCompra: parseFloat(nuevoIngCantidad), 
      unidadBase: nuevoIngUnidad, 
      costoPorUnidadBase: costoNuevo 
    };

    try {
      if (editandoIngId && ingAnterior) {
        // Calcular impacto antes de guardar
        const afectados = calcularImpacto(editandoIngId, ingAnterior.costoPorUnidadBase, costoNuevo);
        
        await updateDoc(doc(db, "ingredientes", editandoIngId), datos);

        if (afectados.length > 0) {
          setAlertaImpacto({
            ingrediente: nuevoIngNombre,
            porcentajeIng: ((costoNuevo - ingAnterior.costoPorUnidadBase) / ingAnterior.costoPorUnidadBase) * 100,
            productos: afectados
          });
          setMensaje(`⚠️ Precio actualizado — ${afectados.length} producto(s) cambiaron su costo`);
        } else {
          setMensaje("✅ Precio actualizado — ningún producto usa este ingrediente todavía");
        }
        setTimeout(() => { setMensaje(''); setAlertaImpacto(null); }, 8000);
      } else {
        await addDoc(collection(db, "ingredientes"), datos);
        setMensaje("✅ Ingrediente agregado a la alacena");
        setTimeout(() => setMensaje(''), 4000);
      }
      limpiarIngrediente();
    } catch (err) { alert("Error al guardar ingrediente"); }
  };

  const prepararEdicionIngrediente = (ing) => {
    setEditandoIngId(ing.id);
    setIngAnterior(ing); // ← guardamos estado original
    setNuevoIngNombre(ing.nombre);
    setNuevoIngCosto(ing.costoCompra);
    setNuevoIngCantidad(ing.cantidadCompra);
    setNuevoIngUnidad(ing.unidadBase);
    setAlertaImpacto(null);
  };

  const limpiarIngrediente = () => {
    setEditandoIngId(null);
    setIngAnterior(null);
    setNuevoIngNombre(''); setNuevoIngCosto(''); setNuevoIngCantidad(''); setNuevoIngUnidad('g');
    setAlertaImpacto(null);
  };

  const eliminarIngredienteDB = async (id) => {
    if (window.confirm("¿Eliminar ingrediente?")) {
      await deleteDoc(doc(db, "ingredientes", id));
      if (editandoIngId === id) limpiarIngrediente();
    }
  };

  // Receta
  const agregarALaReceta = (e) => {
    e.preventDefault();
    if (!recetaIngId || !recetaCantidad) return;
    const ing = ingredientesDB.find(i => i.id === recetaIngId);
    if (!ing) return;
    const mult = factorConversion[recetaMedida];
    const totalUnidades = parseFloat(recetaCantidad) * mult;
    const etiqueta = recetaMedida === 'unidad_base' ? ing.unidadBase : recetaMedida.replace('_', ' ');
    
    setMaterialesReceta([...materialesReceta, { 
      id: Date.now(), 
      ingredienteId: ing.id, 
      nombre: `${recetaCantidad} ${etiqueta} de ${ing.nombre}`, 
      cantidadUnidadBase: totalUnidades 
    }]);
    setRecetaIngId(''); setRecetaCantidad(''); setRecetaMedida('unidad_base');
  };

  const obtenerCostoItem = (item) => {
    const ing = ingredientesDB.find(i => i.id === item.ingredienteId);
    if (!ing) return 0;
    return item.cantidadUnidadBase * ing.costoPorUnidadBase;
  };

  const eliminarDeLaReceta = (id) => {
    setMaterialesReceta(materialesReceta.filter(i => i.id !== id));
  };

  // Presentaciones
  const agregarPresentacion = () => {
    setPresentaciones([...presentaciones, { id: Date.now(), cantidad: 1, nombre: '', precioVenta: '' }]);
  };
  const eliminarPresentacion = (id) => {
    setPresentaciones(presentaciones.filter(p => p.id !== id));
  };
  const actualizarPresentacion = (id, campo, valor) => {
    setPresentaciones(presentaciones.map(p => p.id === id ? { ...p, [campo]: valor } : p));
  };

  // 💾 Guardar receta
  const guardarRecetaEnProducto = async () => {
    if (!productoSeleccionadoId) {
      alert("⚠️ Primero selecciona un producto del menú desplegable arriba");
      return;
    }
    try {
      const presValidas = presentaciones.filter(p => p.nombre && p.precioVenta);
      const presCatalogo = presValidas.map(p => ({ 
        nombre: p.nombre, 
        precio: parseFloat(p.precioVenta), 
        cantidadPiezas: parseInt(p.cantidad) || 1 
      }));
      const precioBase = presCatalogo.length > 0 ? Math.min(...presCatalogo.map(p => p.precio)) : 0;

      await updateDoc(doc(db, "productos", productoSeleccionadoId), {
        precio: precioBase,
        presentaciones: presCatalogo,
        recetaIngredientes: materialesReceta,
        costoRealProduccion: costoPorPieza,
        margenGanancia: margenGanancia,
        precioSugerido: precioPieza,
        piezasPorLote: piezasProducidas,
        fechaModificacion: new Date()
      });
      setMensaje("✅ ¡Receta, costos y precios guardados!");
      setTimeout(() => setMensaje(''), 4000);
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <span className="text-xs font-bold tracking-widest text-[#4A2B50] uppercase bg-[#F5EEFD] px-4 py-1.5 rounded-full">Cotizador Inteligente</span>
        <h2 className="text-3xl font-serif font-bold text-[#4A2B50] mt-3">Recetas y Costos</h2>
      </div>

      {mensaje && (
        <div className={`mb-6 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 ${
          alertaImpacto ? 'bg-amber-100 border border-amber-300 text-amber-800' : 'bg-emerald-100 border border-emerald-300 text-emerald-800'
        }`}>
          <i className={`fa-solid ${alertaImpacto ? 'fa-triangle-exclamation text-xl' : 'fa-circle-check text-xl'}`}></i> 
          {mensaje}
        </div>
      )}

      {/* 🚨 ALERTA DETALLADA DE IMPACTO */}
      {alertaImpacto && (
        <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
          <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-chart-line"></i> Impacto en costos — {alertaImpacto.ingrediente}
            <span className={`ml-auto text-sm px-3 py-1 rounded-full font-bold ${alertaImpacto.porcentajeIng > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {alertaImpacto.porcentajeIng > 0 ? '⬆️' : '⬇️'} {Math.abs(alertaImpacto.porcentajeIng).toFixed(1)}%
            </span>
          </h4>
          <div className="overflow-hidden rounded-xl border border-amber-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-amber-100/50 text-amber-800">
                  <th className="text-left py-2 px-4 font-bold">Producto</th>
                  <th className="text-right py-2 px-4 font-bold">Costo Anterior</th>
                  <th className="text-right py-2 px-4 font-bold">Costo Nuevo</th>
                  <th className="text-right py-2 px-4 font-bold">Variación</th>
                </tr>
              </thead>
              <tbody>
                {alertaImpacto.productos.map((prod, i) => (
                  <tr key={i} className="border-t border-amber-100">
                    <td className="py-3 px-4 font-medium">{prod.nombre}</td>
                    <td className="py-3 px-4 text-right text-slate-500">${prod.costoAnterior.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#4A2B50]">${prod.costoNuevo.toFixed(2)}</td>
                    <td className={`py-3 px-4 text-right font-bold ${prod.impactoPorPieza > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {prod.impactoPorPieza > 0 ? '+' : ''}${prod.impactoPorPieza.toFixed(2)} / pza
                      <span className="block text-xs opacity-70">
                        {prod.porcentajeCambio !== 0 && (prod.porcentajeCambio > 0 ? '+' : '')}{prod.porcentajeCambio.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-amber-700">
            💡 Ve al producto afectado y presiona "Guardar Receta y Precios" para actualizar su costo y precio sugerido.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Alacena */}
        <div className="lg:col-span-4 bg-slate-800 rounded-3xl p-6 text-white shadow-lg flex flex-col h-[900px]">
          <h3 className="font-bold text-lg text-emerald-400 mb-4">
            <i className="fa-solid fa-database mr-2"></i> Mi Alacena
          </h3>
          
          <form onSubmit={guardarIngredienteDB} className="space-y-3 mb-6 bg-slate-700/50 p-4 rounded-2xl">
            <p className="text-xs text-slate-400 mb-2">
              {editandoIngId ? '✏️ Estás editando — cambia solo lo que necesites' : '➕ Agrega un nuevo ingrediente'}
            </p>
            
            <input 
              type="text" 
              placeholder="Ej: Harina, Azúcar, Mantequilla..." 
              value={nuevoIngNombre} 
              onChange={(e)=>setNuevoIngNombre(e.target.value)} 
              className="w-full bg-slate-900 rounded-xl px-3 py-2 text-sm text-white" 
              required 
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">💲 Precio que pagaste</label>
                <input 
                  type="number" step="0.01" 
                  placeholder="$$$" 
                  value={nuevoIngCosto} 
                  onChange={(e)=>setNuevoIngCosto(e.target.value)} 
                  className="w-full bg-slate-900 rounded-xl px-3 py-2 text-sm text-white" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">📦 Cantidad que traía</label>
                <input 
                  type="number" step="0.01" 
                  placeholder="Ej: 1000, 500, 1" 
                  value={nuevoIngCantidad} 
                  onChange={(e)=>setNuevoIngCantidad(e.target.value)} 
                  className="w-full bg-slate-900 rounded-xl px-3 py-2 text-sm text-white" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">📏 Unidad de medida</label>
              <select 
                value={nuevoIngUnidad} 
                onChange={(e)=>setNuevoIngUnidad(e.target.value)} 
                className="w-full bg-slate-900 rounded-xl px-3 py-2 text-sm text-white"
              >
                <option value="g">Gramos (g)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="pz">Piezas / Unidades</option>
              </select>
            </div>

            <div className="bg-slate-900/50 p-2 rounded-lg text-xs text-slate-300">
              📌 Costo por unidad: <strong className="text-emerald-400">
                {nuevoIngCosto && nuevoIngCantidad 
                  ? `$${(parseFloat(nuevoIngCosto) / parseFloat(nuevoIngCantidad)).toFixed(4)} / ${nuevoIngUnidad}` 
                  : '—'}
              </strong>
              {editandoIngId && ingAnterior && (
                <span className="ml-2 text-amber-400">
                  (antes: ${ingAnterior.costoPorUnidadBase.toFixed(4)})
                </span>
              )}
            </div>

            <button 
              type="submit" 
              className={`w-full font-bold py-2.5 rounded-xl ${editandoIngId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white transition-colors`}
            >
              {editandoIngId ? '✏️ Actualizar Precio' : '➕ Agregar Ingrediente'}
            </button>

            {editandoIngId && (
              <button 
                type="button" 
                onClick={limpiarIngrediente}
                className="w-full font-bold py-2 rounded-xl bg-slate-600 hover:bg-slate-500 text-white text-sm"
              >
                Cancelar edición
              </button>
            )}
          </form>

          <div className="flex-1 overflow-y-auto space-y-2">
            {ingredientesDB.map(ing => (
              <div key={ing.id} className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">{ing.nombre}</p>
                  <p className="text-xs text-slate-400">
                    Pagaste: <span className="text-white">${ing.costoCompra}</span> por{' '}
                    <span className="text-white">{ing.cantidadCompra}{ing.unidadBase}</span>
                    <br />
                    → <span className="text-emerald-400">${ing.costoPorUnidadBase.toFixed(4)} / {ing.unidadBase}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={()=>prepararEdicionIngrediente(ing)} 
                    className="text-slate-400 hover:text-amber-400 text-lg"
                    title="Editar precio o cantidad"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button 
                    onClick={()=>eliminarIngredienteDB(ing.id)} 
                    className="text-slate-400 hover:text-red-400 text-lg"
                    title="Eliminar ingrediente"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Principal */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Selección de producto */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <label className="block text-xs font-bold text-[#4A2B50] uppercase mb-2">
              🔗 ¿De qué producto quieres editar la receta?
            </label>
            <select 
              value={productoSeleccionadoId} 
              onChange={(e) => setProductoSeleccionadoId(e.target.value)}
              className="w-full bg-slate-50 border-2 border-[#4A2B50]/30 rounded-xl px-4 py-3 text-lg font-bold text-[#4A2B50] focus:outline-none focus:border-[#4A2B50]"
            >
              <option value="">-- Selecciona un producto del catálogo --</option>
              {productosDB.length === 0 ? (
                <option disabled>⚠️ No hay productos aún. Crea uno en el Catálogo primero.</option>
              ) : (
                productosDB.map(prod => (
                  <option key={prod.id} value={prod.id}>
                    {prod.nombre} {prod.recetaIngredientes?.length > 0 ? '✅' : ''}
                  </option>
                ))
              )}
            </select>
            {productosDB.length === 0 && (
              <p className="mt-3 text-sm text-amber-600 bg-amber-50 p-3 rounded-xl">
                <i className="fa-solid fa-lightbulb mr-1"></i> 
                No encuentras tu producto? Ve primero a <strong>Catálogo</strong> y créalo. Luego regresa aquí.
              </p>
            )}
          </div>

          {productoSeleccionadoId && (
            <>
              {/* Datos del lote */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-[#4A2B50] mb-4">{nombreProducto}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Piezas por lote</label>
                    <input 
                      type="number" min="1" 
                      value={piezasProducidas} 
                      onChange={(e) => setPiezasProducidas(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Margen de ganancia: {margenGanancia}%</label>
                    <input 
                      type="range" min="10" max="300" step="5" 
                      value={margenGanancia} 
                      onChange={(e) => setMargenGanancia(parseInt(e.target.value))} 
                      className="w-full accent-emerald-500" 
                    />
                  </div>
                </div>
              </div>

              {/* Receta */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-[#4A2B50] mb-4">
                  Ingredientes de la Receta 
                  <span className="ml-2 text-sm font-normal text-slate-500">({materialesReceta.length})</span>
                </h3>
                <form onSubmit={agregarALaReceta} className="grid md:grid-cols-4 gap-2 mb-6 bg-slate-50 p-4 rounded-2xl">
                  <select 
                    value={recetaIngId} 
                    onChange={(e)=>setRecetaIngId(e.target.value)} 
                    className="md:col-span-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" 
                    required
                  >
                    <option value="">Agregar de la alacena...</option>
                    {ingredientesDB.map(ing => <option key={ing.id} value={ing.id}>{ing.nombre}</option>)}
                  </select>
                  <input 
                    type="number" step="0.1" min="0.1" 
                    placeholder="Cantidad" 
                    value={recetaCantidad} 
                    onChange={(e)=>setRecetaCantidad(e.target.value)} 
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" 
                    required 
                  />
                  <div className="flex gap-2">
                    <select 
                      value={recetaMedida} 
                      onChange={(e)=>setRecetaMedida(e.target.value)} 
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs"
                    >
                      <option value="unidad_base">g/ml/pz</option>
                      <option value="taza_liquido">Taza Líq</option>
                      <option value="taza_harina">Taza Harina</option>
                      <option value="cucharada">Cuch. Sopera</option>
                      <option value="cucharadita">Cucharadita</option>
                    </select>
                    <button type="submit" className="bg-[#4A2B50] text-white px-3 rounded-xl font-bold">+</button>
                  </div>
                </form>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {materialesReceta.length === 0 ? (
                    <p className="text-center py-6 text-slate-400">Aún no hay ingredientes. Agrega uno desde tu alacena arriba.</p>
                  ) : materialesReceta.map((item, i) => (
                    <div key={item.id || i} className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl">
                      <span className="text-sm">{item.nombre}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-[#4A2B50]">
                          ${obtenerCostoItem(item).toFixed(2)}
                        </span>
                        <button onClick={() => eliminarDeLaReceta(item.id)} className="text-slate-400 hover:text-red-500">
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t text-right">
                  <span className="text-slate-500 mr-4">Costo Total del Lote:</span>
                  <span className="text-xl font-black text-[#4A2B50]">${costoTotal.toFixed(2)}</span>
                  <span className="ml-4 text-emerald-600 font-bold">→ ${costoPorPieza.toFixed(2)} / pieza</span>
                  <p className="text-xs text-slate-400 mt-1">🔄 Los costos se actualizan automáticamente si cambias precios en la alacena</p>
                </div>
              </div>

              {/* Presentaciones */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-[#4A2B50]">Precios de Venta</h3>
                  <button type="button" onClick={agregarPresentacion} className="text-xs font-bold bg-[#F5EEFD] text-[#4A2B50] px-3 py-2 rounded-xl">+ Agregar</button>
                </div>
                <div className="space-y-2">
                  {presentaciones.map(p => {
                    const sugerido = (costoPorPieza * (p.cantidad||1)) * (1 + margenGanancia/100);
                    return (
                      <div key={p.id} className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl">
                        <div className="w-20">
                          <label className="block text-[10px] font-bold text-slate-400">Piezas</label>
                          <input 
                            type="number" min="1" 
                            value={p.cantidad} 
                            onChange={(e) => actualizarPresentacion(p.id, 'cantidad', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-sm font-bold text-center" 
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-400">Nombre</label>
                          <input 
                            type="text" 
                            value={p.nombre} 
                            onChange={(e) => actualizarPresentacion(p.id, 'nombre', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm" 
                          />
                        </div>
                        <div className="w-28 text-right">
                          <span className="block text-[10px] text-slate-400">Sugerido</span>
                          <span className="font-bold text-emerald-600">${sugerido.toFixed(2)}</span>
                        </div>
                        <div className="w-28">
                          <label className="block text-[10px] font-bold text-slate-400">Precio Final</label>
                          <input 
                            type="number" step="0.50" 
                            value={p.precioVenta} 
                            onChange={(e) => actualizarPresentacion(p.id, 'precioVenta', e.target.value)}
                            className="w-full bg-white border-2 border-emerald-200 rounded-lg px-3 py-2 text-sm font-bold" 
                          />
                        </div>
                        {presentaciones.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => eliminarPresentacion(p.id)} 
                            className="text-slate-300 hover:text-red-500"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guardar */}
              <div className="flex justify-end">
                <button 
                  onClick={guardarRecetaEnProducto} 
                  className="bg-[#4A2B50] hover:bg-opacity-90 text-white font-bold px-8 py-3 rounded-xl text-lg shadow-md"
                >
                  💾 Guardar Receta y Precios
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cotizador;



