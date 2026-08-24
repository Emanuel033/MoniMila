import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import Cotizador from './Cotizador';

function Admin() {
  const [seccionActiva, setSeccionActiva] = useState('catalogo');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  
  const [editandoId, setEditandoId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [imagenBase64, setImagenBase64] = useState('');
  const [nombreArchivo, setNombreArchivo] = useState('');

  // === PRESENTACIONES — Se definen aquí y se complementan en Cotizador ===
  const [presentaciones, setPresentaciones] = useState([
    { nombre: '1 Pieza', precio: '', cantidadPiezas: 1 }
  ]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "productos"), (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProductos(lista);
    });
    return () => unsubscribe();
  }, []);

  const productosOrdenados = useMemo(() => 
    [...productos].sort((a, b) => (a.nombre || '').localeCompare(b.nombre || '')),
    [productos]
  );

  const manejarImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNombreArchivo(file.name);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; 
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;
        if (width > height && width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } 
        else if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setImagenBase64(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  };

  const validarFormulario = () => {
    if (!nombre.trim()) {
      alert("⚠️ Escribe el nombre del producto");
      return false;
    }
    if (presentaciones.some(p => !p.precio || parseFloat(p.precio) <= 0)) {
      alert("⚠️ Todas las presentaciones deben tener un precio mayor a $0");
      return false;
    }
    return true;
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      setCargando(true);
      
      const presentacionesValidas = presentaciones.map(p => ({
        nombre: p.nombre || 'Presentación',
        precio: parseFloat(p.precio) || 0,
        cantidadPiezas: parseInt(p.cantidadPiezas) || 1
      }));

      const precioBaseMinimo = Math.min(...presentacionesValidas.map(p => p.precio));

      const datosProducto = {
        nombre: nombre.trim(),
        descripcion: descripcion || '',
        precio: precioBaseMinimo,
        categoria: categoria || 'General',
        subcategoria: subcategoria || '',
        imagen: imagenBase64 || 'https://via.placeholder.com/800',
        presentaciones: presentacionesValidas,
        fechaModificacion: new Date()
      };

      if (editandoId) {
        await updateDoc(doc(db, "productos", editandoId), datosProducto);
        setMensaje("¡Producto actualizado! ✏️ Ahora ve al Cotizador para definir su receta y costos.");
      } else {
        datosProducto.fechaCreacion = new Date();
        await addDoc(collection(db, "productos"), datosProducto);
        setMensaje("¡Producto agregado! 🎉 Ahora ve al Cotizador para calcular costos y receta.");
      }
      limpiarFormulario();
    } catch (error) {
      alert("Error al guardar: " + error.message);
    } finally {
      setCargando(false);
      setTimeout(() => setMensaje(''), 5000);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      await deleteDoc(doc(db, "productos", id));
    }
  };

  const prepararEdicion = (producto) => {
    setEditandoId(producto.id);
    setNombre(producto.nombre || '');
    setDescripcion(producto.descripcion || '');
    setCategoria(producto.categoria || '');
    setSubcategoria(producto.subcategoria || '');
    setImagenBase64(producto.imagen || '');
    
    if (!producto.presentaciones || producto.presentaciones.length === 0) {
      setPresentaciones([{ nombre: '1 Pieza', precio: producto.precio || '', cantidadPiezas: 1 }]);
    } else {
      setPresentaciones(producto.presentaciones.map(p => ({
        nombre: p.nombre || '',
        precio: p.precio || '',
        cantidadPiezas: p.cantidadPiezas || 1
      })));
    }

    setNombreArchivo('Imagen existente cargada');
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre('');
    setDescripcion('');
    setCategoria('');
    setSubcategoria('');
    setImagenBase64('');
    setNombreArchivo('');
    setPresentaciones([{ nombre: '1 Pieza', precio: '', cantidadPiezas: 1 }]);
  };

  const agregarPresentacion = () => {
    setPresentaciones([...presentaciones, { nombre: '', precio: '', cantidadPiezas: 1 }]);
  };

  const actualizarPresentacion = (index, campo, valor) => {
    const nuevas = [...presentaciones];
    nuevas[index][campo] = valor;
    setPresentaciones(nuevas);
  };

  const eliminarPresentacion = (index) => {
    const nuevas = [...presentaciones];
    nuevas.splice(index, 1);
    setPresentaciones(nuevas);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      <aside className="w-full md:w-64 bg-[#4A2B50] text-white flex flex-col shadow-xl">
        <div className="p-6 text-center border-b border-white/10">
          <h2 className="text-2xl font-serif font-bold text-[#F5EEFD]">MoniMila</h2>
          <span className="text-xs tracking-widest opacity-70 uppercase">Administración</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button onClick={() => setSeccionActiva('catalogo')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${seccionActiva === 'catalogo' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
            <i className="fa-solid fa-cake-candles w-5"></i> Catálogo
          </button>
          <button onClick={() => setSeccionActiva('cotizador')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${seccionActiva === 'cotizador' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
            <i className="fa-solid fa-calculator w-5"></i> Cotizador & Receta
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {seccionActiva === 'catalogo' && (
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm border-2 transition-colors ${editandoId ? 'border-amber-400' : 'border-slate-100'}`}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#4A2B50]">
                    {editandoId ? '✏️ Editar Producto' : '✨ Nuevo Producto'}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    {editandoId 
                      ? "Modifica los datos del producto. Los costos y receta se manejan en el Cotizador." 
                      : "Registra el producto. Luego ve al Cotizador para definir su receta y costos."}
                  </p>
                </div>
                {editandoId && (
                  <button onClick={limpiarFormulario} className="text-sm bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-bold hover:bg-slate-200">Cancelar</button>
                )}
              </div>
              
              {mensaje && (
                <div className="mb-6 bg-emerald-100 border border-emerald-300 text-emerald-800 px-6 py-4 rounded-2xl font-bold flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-xl"></i> {mensaje}
                </div>
              )}

              <form onSubmit={guardarProducto} className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Producto *</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Ej. Alfajores Clásicos"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                    <textarea rows="2" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej. Galletas rellenas de dulce de leche"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]"></textarea>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                    <input list="categorias-sugeridas" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]" />
                    <datalist id="categorias-sugeridas"><option value="Alfajores"/><option value="Roscas"/><option value="Saludable"/></datalist>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subcategoría</label>
                    <input type="text" value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Foto</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-2 text-center relative cursor-pointer flex items-center justify-center bg-slate-50 overflow-hidden h-[46px]">
                      <input type="file" accept="image/*" onChange={manejarImagen} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                      {imagenBase64 ? (
                        <div className="flex items-center gap-2">
                          <img src={imagenBase64} alt="Vista previa" className="w-8 h-8 object-cover rounded-lg" />
                          <span className="text-xs text-emerald-600 font-bold truncate">✓ {nombreArchivo || 'Imagen cargada'}</span>
                        </div>
                      ) : <span className="text-xs text-slate-500">Subir imagen</span>}
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-bold text-[#4A2B50] text-lg">Precios al Público</h3>
                      <p className="text-xs text-slate-500">Define los paquetes y precios de venta</p>
                    </div>
                    <button type="button" onClick={agregarPresentacion} className="text-xs font-bold bg-[#F5EEFD] text-[#4A2B50] px-3 py-2 rounded-xl hover:bg-[#eadeff]">
                      <i className="fa-solid fa-plus mr-1"></i> Agregar Paquete
                    </button>
                  </div>

                  <div className="space-y-3">
                    {presentaciones.map((pres, index) => (
                      <div key={index} className="flex gap-3 items-center bg-white border border-slate-200 rounded-xl p-3">
                        <div className="w-24">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Piezas</label>
                          <input type="number" min="1" value={pres.cantidadPiezas} onChange={(e) => actualizarPresentacion(index, 'cantidadPiezas', e.target.value)} required
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm font-bold text-center" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Nombre</label>
                          <input type="text" placeholder="Ej. 6 Piezas" value={pres.nombre} onChange={(e) => actualizarPresentacion(index, 'nombre', e.target.value)} required
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="w-32">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Precio ($)</label>
                          <input type="number" step="0.50" placeholder="0.00" value={pres.precio} onChange={(e) => actualizarPresentacion(index, 'precio', e.target.value)} required
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold" />
                        </div>
                        {presentaciones.length > 1 && (
                          <button type="button" onClick={() => eliminarPresentacion(index)} className="text-slate-300 hover:text-red-500 mt-4 px-1"><i className="fa-solid fa-trash"></i></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                  <p className="text-sm text-slate-500">
                    <i className="fa-solid fa-calculator mr-1 text-[#4A2B50]"></i>
                    ¿Necesitas calcular costos y receta? → Ve al <strong onClick={() => setSeccionActiva('cotizador')} className="text-[#4A2B50] cursor-pointer hover:underline">Cotizador</strong>
                  </p>
                  <button type="submit" disabled={cargando} className="bg-[#4A2B50] hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2">
                    {cargando ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
                    {editandoId ? 'Actualizar' : 'Guardar Producto'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-[#4A2B50] mb-6">📦 Productos ({productosOrdenados.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-xl">Foto</th>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">Precio</th>
                      <th className="px-4 py-3">Receta</th>
                      <th className="px-4 py-3 rounded-tr-xl text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productosOrdenados.length === 0 ? (
                      <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-400">
                        No hay productos aún. Crea el primero arriba 👆
                      </td></tr>
                    ) : (
                      productosOrdenados.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3"><img src={prod.imagen} alt={prod.nombre} className="w-12 h-12 object-cover rounded-lg" /></td>
                          <td className="px-4 py-3 font-medium">{prod.nombre}</td>
                          <td className="px-4 py-3 font-bold text-emerald-600">${prod.precio}</td>
                          <td className="px-4 py-3">
                            {prod.recetaIngredientes?.length > 0 
                              ? <span className="text-emerald-600 text-sm">✅ {prod.recetaIngredientes.length} ingredientes</span>
                              : <span className="text-slate-400 text-sm">Sin receta</span>}
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button onClick={() => prepararEdicion(prod)} className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100">
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button onClick={() => eliminarProducto(prod.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
        
        {seccionActiva === 'cotizador' && <Cotizador />}
      </main>
    </div>
  );
}

export default Admin;