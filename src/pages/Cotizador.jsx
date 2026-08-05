import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';

function Cotizador() {
  // === ESTADOS DE LA BASE DE DATOS (INGREDIENTES Y PRODUCTOS) ===
  const [ingredientesDB, setIngredientesDB] = useState([]);
  const [productosDB, setProductosDB] = useState([]); 
  
  // Estados para el formulario de la Alacena
  const [editandoIngId, setEditandoIngId] = useState(null);
  const [nuevoIngNombre, setNuevoIngNombre] = useState('');
  const [nuevoIngCosto, setNuevoIngCosto] = useState('');
  const [nuevoIngCantidad, setNuevoIngCantidad] = useState('');
  const [nuevoIngUnidad, setNuevoIngUnidad] = useState('g');

  // === ESTADOS DE LA RECETA (CALCULADORA) ===
  const [nombreProducto, setNombreProducto] = useState('Nueva Receta');
  const [piezasProducidas, setPiezasProducidas] = useState(1); 
  const [materialesReceta, setMaterialesReceta] = useState([]);
  
  const [recetaIngId, setRecetaIngId] = useState('');
  const [recetaCantidad, setRecetaCantidad] = useState('');
  const [recetaMedida, setRecetaMedida] = useState('unidad_base'); 
  const [margenGanancia, setMargenGanancia] = useState(50);
  
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(''); 
  const [mensajeVinculacion, setMensajeVinculacion] = useState('');

  // === NUEVO: ESTADO DE PRESENTACIONES / PAQUETES Y PRECIOS ===
  const [presentaciones, setPresentaciones] = useState([
    { id: 1, cantidad: 1, nombre: '1 Pieza', precioVenta: '' },
    { id: 2, cantidad: 6, nombre: '6 Piezas (Media Docena)', precioVenta: '' },
    { id: 3, cantidad: 12, nombre: '12 Piezas (Docena)', precioVenta: '' }
  ]);

  const factorConversion = {
    unidad_base: 1, 
    taza_liquido: 250, 
    taza_harina: 120, 
    taza_azucar: 200, 
    taza_avena: 90, 
    cucharada: 15, 
    cucharadita: 5 
  };

  useEffect(() => {
    const unsubIng = onSnapshot(collection(db, "ingredientes"), (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIngredientesDB(lista.sort((a, b) => a.nombre.localeCompare(b.nombre)));
    });

    const unsubProd = onSnapshot(collection(db, "productos"), (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductosDB(lista);
    });

    return () => {
      unsubIng();
      unsubProd();
    };
  }, []);

  const guardarIngredienteDB = async (e) => {
    e.preventDefault();
    if (!nuevoIngNombre || !nuevoIngCosto || !nuevoIngCantidad) return;
    
    const costoBase = parseFloat(nuevoIngCosto) / parseFloat(nuevoIngCantidad);
    
    try {
      const datosIngrediente = {
        nombre: nuevoIngNombre,
        costoCompra: parseFloat(nuevoIngCosto),
        cantidadCompra: parseFloat(nuevoIngCantidad),
        unidadBase: nuevoIngUnidad,
        costoPorUnidadBase: costoBase
      };

      if (editandoIngId) {
        await updateDoc(doc(db, "ingredientes", editandoIngId), datosIngrediente);
        setEditandoIngId(null);
      } else {
        await addDoc(collection(db, "ingredientes"), datosIngrediente);
      }
      limpiarFormularioIngrediente();
    } catch (error) { 
      console.error("Error al guardar ingrediente:", error);
      alert("Error al guardar en la alacena"); 
    }
  };

  const prepararEdicionIngrediente = (ing) => {
    setEditandoIngId(ing.id);
    setNuevoIngNombre(ing.nombre);
    setNuevoIngCosto(ing.costoCompra);
    setNuevoIngCantidad(ing.cantidadCompra);
    setNuevoIngUnidad(ing.unidadBase);
  };

  const limpiarFormularioIngrediente = () => {
    setEditandoIngId(null);
    setNuevoIngNombre(''); 
    setNuevoIngCosto(''); 
    setNuevoIngCantidad('');
    setNuevoIngUnidad('g');
  };

  const eliminarIngredienteDB = async (id) => {
    if (window.confirm("¿Borrar ingrediente de la alacena?")) {
      await deleteDoc(doc(db, "ingredientes", id));
      if (editandoIngId === id) limpiarFormularioIngrediente();
    }
  };

  const agregarALaReceta = (e) => {
    e.preventDefault();
    if (!recetaIngId || !recetaCantidad) return;
    const ingSeleccionado = ingredientesDB.find(i => i.id === recetaIngId);
    if (!ingSeleccionado) return;

    const multiplicador = factorConversion[recetaMedida];
    const unidadesTotales = parseFloat(recetaCantidad) * multiplicador;
    const costoCalculado = unidadesTotales * ingSeleccionado.costoPorUnidadBase;
    const etiquetaMedida = recetaMedida === 'unidad_base' ? ingSeleccionado.unidadBase : recetaMedida.replace('_', ' ');

    setMaterialesReceta([
      ...materialesReceta,
      { 
        id: Date.now(), 
        ingredienteId: ingSeleccionado.id, 
        nombre: `${recetaCantidad} ${etiquetaMedida} de ${ingSeleccionado.nombre}`, 
        costo: costoCalculado,
        cantidadUnidadBase: unidadesTotales 
      }
    ]);

    setRecetaIngId(''); setRecetaCantidad(''); setRecetaMedida('unidad_base');
  };

  const eliminarDeLaReceta = (id) => {
    setMaterialesReceta(materialesReceta.filter(item => item.id !== id));
  };

  const costoTotalInsumos = materialesReceta.reduce((total, item) => total + item.costo, 0);
  const piezasValidas = piezasProducidas > 0 ? piezasProducidas : 1;
  const costoPorPieza = costoTotalInsumos / piezasValidas;
  const gananciaPorPieza = costoPorPieza * (margenGanancia / 100);
  
  const precioPieza = costoPorPieza + gananciaPorPieza;
  const precioMediaDocena = precioPieza * 6;
  const precioDocena = precioPieza * 12;

  // === FUNCIONES DE GESTIÓN DE PRESENTACIONES ===
  const agregarPresentacion = () => {
    setPresentaciones([...presentaciones, { id: Date.now(), cantidad: 1, nombre: '', precioVenta: '' }]);
  };
  const eliminarPresentacion = (id) => {
    setPresentaciones(presentaciones.filter(p => p.id !== id));
  };
  const actualizarPresentacion = (id, campo, valor) => {
    setPresentaciones(presentaciones.map(p => p.id === id ? { ...p, [campo]: valor } : p));
  };

  // === VINCULACIÓN INTELIGENTE (RECETA + PRESENTACIONES AL CATÁLOGO) ===
  const guardarRecetaEnProducto = async () => {
    if (!productoSeleccionadoId) {
      alert("Por favor selecciona a qué producto del menú pertenece esta receta.");
      return;
    }

    const presentacionesValidas = presentaciones.filter(p => p.nombre && p.precioVenta !== '');
    if (presentacionesValidas.length === 0) {
      alert("Debes configurar al menos una presentación con su precio de venta.");
      return;
    }

    try {
      // Formateamos las presentaciones para que el catálogo las lea directo
      const presentacionesCatalogo = presentacionesValidas.map(p => ({
        nombre: p.nombre,
        precio: parseFloat(p.precioVenta),
        cantidadPiezas: parseInt(p.cantidad) || 1 // Guardamos cuántas piezas trae este paquete para futuros pedidos
      }));

      // Buscamos el precio más económico para definir el "Precio Base / Desde" en la tarjeta principal
      const precioBaseMinimo = Math.min(...presentacionesCatalogo.map(p => p.precio));

      const productoRef = doc(db, "productos", productoSeleccionadoId);
      await updateDoc(productoRef, {
        precio: precioBaseMinimo,
        presentaciones: presentacionesCatalogo,
        recetaIngredientes: materialesReceta, // Receta base intacta
        costoRealProduccion: costoPorPieza,
        precioSugerido: precioPieza,
        piezasPorLote: piezasProducidas // <- ESTE ES EL SECRETO: El lote original (ej. 6 piezas) para calcular las proporciones exactas al restar stock después
      });

      setMensajeVinculacion("¡Receta, presentaciones y precios sincronizados con éxito en el producto! 🔗✨");
      setTimeout(() => setMensajeVinculacion(''), 4000);
    } catch (error) {
      console.error("Error al vincular:", error);
      alert("Hubo un error al vincular la receta.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <div className="text-center mb-8">
        <span className="text-xs font-bold tracking-widest text-[#4A2B50] uppercase bg-[#F5EEFD] px-4 py-1.5 rounded-full">Inteligencia Financiera & Producción</span>
        <h2 className="text-3xl font-serif font-bold text-[#4A2B50] mt-3">Cotizador y Recetario</h2>
      </div>

      {mensajeVinculacion && (
        <div className="mb-6 bg-emerald-100 border border-emerald-300 text-emerald-800 px-6 py-4 rounded-2xl font-bold flex items-center gap-3">
          <i className="fa-solid fa-circle-check text-xl"></i> {mensajeVinculacion}
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: ALACENA CON CRUD COMPLETO */}
        <div className="lg:col-span-4 bg-slate-800 rounded-3xl p-6 text-white shadow-lg flex flex-col h-[900px]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg text-emerald-400"><i className="fa-solid fa-database mr-2"></i> Mi Alacena (BD)</h3>
            {editandoIngId && (
              <button onClick={limpiarFormularioIngrediente} className="text-xs text-amber-300 hover:underline">Cancelar edición</button>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-4">
            {editandoIngId ? '✏️ Editando ingrediente activo' : 'Registra costos de compra por gramo, ml o pieza.'}
          </p>

          <form onSubmit={guardarIngredienteDB} className="space-y-3 mb-6 bg-slate-700/50 p-4 rounded-2xl border border-slate-700">
            <input type="text" placeholder="Nombre (ej. Harina, Azúcar)" value={nuevoIngNombre} onChange={(e)=>setNuevoIngNombre(e.target.value)} className="w-full bg-slate-900 border-none rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500" required />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" step="0.01" placeholder="Costo ($)" value={nuevoIngCosto} onChange={(e)=>setNuevoIngCosto(e.target.value)} className="w-full bg-slate-900 border-none rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500" required />
              <input type="number" step="0.01" placeholder="Trae (ej. 1000)" value={nuevoIngCantidad} onChange={(e)=>setNuevoIngCantidad(e.target.value)} className="w-full bg-slate-900 border-none rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500" required />
            </div>
            <select value={nuevoIngUnidad} onChange={(e)=>setNuevoIngUnidad(e.target.value)} className="w-full bg-slate-900 border-none rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500">
              <option value="g">Gramos</option>
              <option value="ml">Mililitros</option>
              <option value="pz">Piezas</option>
            </select>
            <button type="submit" className={`w-full font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm ${editandoIngId ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}>
              {editandoIngId ? 'Actualizar Ingrediente' : 'Guardar en Alacena'}
            </button>
          </form>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {ingredientesDB.map(ing => (
              <div key={ing.id} className={`p-3 rounded-xl flex justify-between items-center group transition-colors ${editandoIngId === ing.id ? 'bg-slate-600 border border-amber-400' : 'bg-slate-700 hover:bg-slate-600'}`}>
                <div>
                  <p className="text-sm font-bold">{ing.nombre}</p>
                  <p className="text-[10px] text-slate-400">${ing.costoCompra} x {ing.cantidadCompra}{ing.unidadBase}</p>
                  <span className="text-[10px] font-mono text-emerald-400">${ing.costoPorUnidadBase.toFixed(4)}/{ing.unidadBase}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>prepararEdicionIngrediente(ing)} title="Editar ingrediente" className="text-slate-400 hover:text-amber-400 p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                    <i className="fa-solid fa-pen text-xs"></i>
                  </button>
                  <button onClick={()=>eliminarIngredienteDB(ing.id)} title="Eliminar ingrediente" className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: ARMADOR DE RECETA, PRESENTACIONES Y VINCULACIÓN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Ficha técnica y VINCULACIÓN */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre de la Receta</label>
                <input type="text" value={nombreProducto} onChange={(e) => setNombreProducto(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A2B50]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Piezas que rinde este lote (Base)</label>
                <input type="number" min="1" value={piezasProducidas} onChange={(e) => setPiezasProducidas(parseInt(e.target.value) || 1)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A2B50]" />
              </div>
            </div>

            {/* SECCIÓN DE VINCULACIÓN CON EL MENÚ */}
            <div className="pt-4 border-t border-slate-100 bg-[#F5EEFD]/40 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-auto flex-1">
                <label className="block text-xs font-bold text-[#4A2B50] uppercase mb-1">Vincular receta y precios con producto del Catálogo:</label>
                <select 
                  value={productoSeleccionadoId} 
                  onChange={(e) => setProductoSeleccionadoId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-[#4A2B50]"
                >
                  <option value="">-- Selecciona el postre en venta --</option>
                  {productosDB.map(prod => (
                    <option key={prod.id} value={prod.id}>{prod.nombre} (${prod.precio})</option>
                  ))}
                </select>
              </div>
              <button 
                type="button" 
                onClick={guardarRecetaEnProducto}
                className="w-full md:w-auto bg-[#4A2B50] hover:bg-opacity-90 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm whitespace-nowrap mt-5 md:mt-0"
              >
                <i className="fa-solid fa-link mr-2"></i> Guardar Receta y Precios
              </button>
            </div>
          </div>

          {/* Constructor de ingredientes */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-serif font-bold text-lg text-[#4A2B50] mb-4">Ingredientes de esta Receta</h3>
            
            <form onSubmit={agregarALaReceta} className="grid md:grid-cols-4 gap-2 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <select value={recetaIngId} onChange={(e)=>setRecetaIngId(e.target.value)} className="md:col-span-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" required>
                <option value="">Selecciona de tu alacena...</option>
                {ingredientesDB.map(ing => (
                  <option key={ing.id} value={ing.id}>{ing.nombre}</option>
                ))}
              </select>
              
              <input type="number" step="0.1" min="0.1" placeholder="Cant. (ej. 2)" value={recetaCantidad} onChange={(e)=>setRecetaCantidad(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" required />
              
              <div className="flex gap-2">
                <select value={recetaMedida} onChange={(e)=>setRecetaMedida(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs">
                  <option value="unidad_base">Gramos/ml/pz</option>
                  <option value="taza_liquido">Taza (Líquidos 250ml)</option>
                  <option value="taza_harina">Taza (Harina 120g)</option>
                  <option value="taza_azucar">Taza (Azúcar 200g)</option>
                  <option value="taza_avena">Taza (Avena 90g)</option>
                  <option value="cucharada">Cuch. Sopera (15g/ml)</option>
                  <option value="cucharadita">Cucharadita (5g/ml)</option>
                </select>
                <button type="submit" className="bg-[#4A2B50] text-white px-3 rounded-xl font-bold hover:bg-opacity-90">+</button>
              </div>
            </form>

            <div className="space-y-2 max-h-50 overflow-y-auto">
              {materialesReceta.length === 0 && <p className="text-center text-sm text-slate-400 py-4">No has agregado ingredientes a la receta.</p>}
              {materialesReceta.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl text-sm border border-slate-100">
                  <span className="font-medium text-slate-700 capitalize">{item.nombre}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#4A2B50]">${item.costo.toFixed(2)}</span>
                    <button onClick={() => eliminarDeLaReceta(item.id)} className="text-slate-300 hover:text-red-500"><i className="fa-solid fa-xmark"></i></button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200 text-right">
              <span className="text-slate-500 text-sm mr-4">Costo Total Receta:</span>
              <span className="text-xl font-black text-[#4A2B50]">${costoTotalInsumos.toFixed(2)}</span>
            </div>
          </div>

          {/* NUEVO: CONFIGURADOR DE PRESENTACIONES Y PRECIOS FINALES */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#4A2B50]">Presentaciones y Precios del Menú</h3>
                <p className="text-xs text-slate-500">Define los paquetes que verá el cliente (1 pz, 6 pz, 12 pz, etc.)</p>
              </div>
              <button type="button" onClick={agregarPresentacion} className="text-xs font-bold bg-[#F5EEFD] text-[#4A2B50] px-3 py-2 rounded-xl hover:bg-[#eadeff]">
                <i className="fa-solid fa-plus mr-1"></i> Agregar Paquete
              </button>
            </div>

            <div className="space-y-2">
              {presentaciones.map((pres) => {
                const cant = parseInt(pres.cantidad) || 1;
                const costoPres = costoPorPieza * cant;
                const sugeridoPres = costoPres * (1 + (margenGanancia / 100));

                return (
                  <div key={pres.id} className="flex gap-3 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="w-24">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Piezas que trae</label>
                      <input type="number" min="1" value={pres.cantidad} onChange={(e) => actualizarPresentacion(pres.id, 'cantidad', e.target.value)} 
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-center text-[#4A2B50]" />
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Nombre para el cliente</label>
                      <input type="text" placeholder="Ej. 6 Piezas (Media Docena)" value={pres.nombre} onChange={(e) => actualizarPresentacion(pres.id, 'nombre', e.target.value)} 
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm" />
                    </div>

                    <div className="w-32 text-right hidden sm:block">
                      <span className="block text-[10px] text-slate-400 uppercase font-bold">Sugerido (${margenGanancia}%)</span>
                      <span className="text-sm font-bold text-emerald-600">${sugeridoPres.toFixed(2)}</span>
                    </div>

                    <div className="w-32">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Precio Final ($)</label>
                      <input type="number" step="0.50" placeholder="0.00" value={pres.precioVenta} onChange={(e) => actualizarPresentacion(pres.id, 'precioVenta', e.target.value)} 
                        className="w-full bg-white border-2 border-emerald-200 rounded-xl px-3 py-1.5 text-sm font-black text-slate-800" />
                    </div>

                    {presentaciones.length > 1 && (
                      <button type="button" onClick={() => eliminarPresentacion(pres.id)} className="text-slate-300 hover:text-red-500 mt-4 px-1">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* GANANCIA Y RESULTADOS */}
          <div className="grid md:grid-cols-2 gap-4">
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif font-bold text-[#4A2B50]">Margen Deseado</h3>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-sm">{margenGanancia}%</span>
              </div>
              <input type="range" min="10" max="300" step="5" value={margenGanancia} onChange={(e) => setMargenGanancia(parseInt(e.target.value))} className="w-full accent-emerald-500" />
            </div>

            <div className="bg-[#4A2B50] p-6 rounded-3xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
              <i className="fa-solid fa-tags absolute -right-4 -bottom-4 text-6xl opacity-10"></i>
              
              <div className="mb-4 border-b border-white/20 pb-4">
                <p className="text-xs text-[#E8D8F8] uppercase tracking-wider mb-1">Costo Base por 1 Pieza</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black">${costoPorPieza.toFixed(2)}</span>
                  <span className="text-sm opacity-70 mb-1">Lote de {piezasProducidas} pz</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-[#E8D8F8]">Sugerido Media Docena (6)</span>
                <span className="font-bold">${precioMediaDocena.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-emerald-300">Sugerido Docena Completa (12)</span>
                <span className="text-emerald-300">${precioDocena.toFixed(2)}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Cotizador;

