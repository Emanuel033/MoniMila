import React, { useState, useEffect } from 'react';
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

  // NUEVO: Modelo simplificado de Presentaciones (Ej. 1 pz, 6 pz, 12 pz)
  const [presentaciones, setPresentaciones] = useState([{ nombre: '1 Pieza', precio: '' }]);

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

  const guardarProducto = async (e) => {
    e.preventDefault();
    // Validar que al menos haya una presentación con precio
    if (!nombre || presentaciones.length === 0 || !presentaciones[0].precio) {
      alert("Por favor completa el nombre y al menos una presentación con su precio.");
      return;
    }

    try {
      setCargando(true);
      
      // Calculamos el precio base automáticamente (el más barato) para mostrar en el catálogo "Desde $X"
      const precios = presentaciones.map(p => parseFloat(p.precio) || 0);
      const precioBaseMinimo = Math.min(...precios);

      const datosProducto = {
        nombre: nombre || '',
        descripcion: descripcion || '',
        precio: precioBaseMinimo, // Precio de referencia
        categoria: categoria || 'General',
        subcategoria: subcategoria || '',
        imagen: imagenBase64 || 'https://via.placeholder.com/800',
        presentaciones: presentaciones, // Guardamos los paquetes exactos
        fechaModificacion: new Date()
      };

      if (editandoId) {
        await updateDoc(doc(db, "productos", editandoId), datosProducto);
        setMensaje("¡Postre actualizado correctamente! ✏️");
      } else {
        datosProducto.fechaCreacion = new Date();
        await addDoc(collection(db, "productos"), datosProducto);
        setMensaje("¡Nuevo postre agregado al menú! 🎉");
      }
      limpiarFormulario();
    } catch (error) {
      alert("Hubo un error al guardar: " + error.message);
    } finally {
      setCargando(false);
      setTimeout(() => setMensaje(''), 4000);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este postre?")) {
      await deleteDoc(doc(db, "productos", id));
    }
  };

  const prepararEdicion = (producto) => {
    setEditandoId(producto.id);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setCategoria(producto.categoria);
    setSubcategoria(producto.subcategoria);
    setImagenBase64(producto.imagen);
    // Si el producto viejo tenía la variable "precio" pero no "presentaciones", lo adaptamos al vuelo
    if (!producto.presentaciones || producto.presentaciones.length === 0) {
      setPresentaciones([{ nombre: 'Única', precio: producto.precio || '' }]);
    } else {
      setPresentaciones(producto.presentaciones);
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
    setPresentaciones([{ nombre: '1 Pieza', precio: '' }]);
  };

  // MANEJO DE PRESENTACIONES
  const agregarPresentacion = () => {
    setPresentaciones([...presentaciones, { nombre: '', precio: '' }]);
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
            <i className="fa-solid fa-cake-candles w-5"></i> Gestión del Menú
          </button>
          <button onClick={() => setSeccionActiva('cotizador')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${seccionActiva === 'cotizador' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
            <i className="fa-solid fa-calculator w-5"></i> Cotizador Inteligente
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {seccionActiva === 'catalogo' && (
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#4A2B50]">
                    {editandoId ? '✏️ Editando Postre' : '✨ Agregar Nuevo Postre'}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">Sube el postre y define los precios exactos por presentación.</p>
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
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Producto</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Ej. Alfajores Clásicos (Dulce de Leche)"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                    <textarea rows="2" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej. Galletas rellenas de dulce de leche (Pueden ir con coco rayado)"
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
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Foto Principal</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-2 text-center relative cursor-pointer flex items-center justify-center bg-slate-50 overflow-hidden h-[46px]">
                      <input type="file" accept="image/*" onChange={manejarImagen} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                      {imagenBase64 ? <span className="text-xs text-emerald-600 font-bold truncate px-2"><i className="fa-solid fa-check mr-1"></i> Foto lista</span> : <span className="text-xs text-slate-500">Subir imagen</span>}
                    </div>
                  </div>
                </div>

                {/* === NUEVO: SECCIÓN DE PRESENTACIONES (PRECIOS CERRADOS) === */}
                <div className="mt-8 border-t border-slate-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-bold text-[#4A2B50] text-lg">Presentaciones y Precios</h3>
                      <p className="text-xs text-slate-500">Agrega el precio exacto por unidad, docena, etc.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {presentaciones.map((pres, index) => (
                      <div key={index} className="flex gap-4 items-center bg-white border border-[#4A2B50]/20 rounded-xl p-3 shadow-sm">
                        <div className="flex-1">
                          <input type="text" placeholder="Ej. 6 Piezas" value={pres.nombre} onChange={(e) => actualizarPresentacion(index, 'nombre', e.target.value)} required
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A2B50]" />
                        </div>
                        <div className="w-32 flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3">
                          <span className="text-slate-400 font-bold">$</span>
                          <input type="number" placeholder="0.00" value={pres.precio} onChange={(e) => actualizarPresentacion(index, 'precio', e.target.value)} required
                            className="w-full py-2 px-2 text-sm outline-none bg-transparent" />
                        </div>
                        {presentaciones.length > 1 && (
                          <button type="button" onClick={() => eliminarPresentacion(index)} className="text-slate-400 hover:text-red-500 px-2"><i className="fa-solid fa-trash"></i></button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={agregarPresentacion} className="text-sm font-bold text-[#4A2B50] mt-2 hover:underline">
                      <i className="fa-solid fa-plus text-xs mr-1"></i> Agregar otro tamaño/paquete
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100">
                  <button type="submit" disabled={cargando} className="bg-[#4A2B50] hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2 text-lg w-full md:w-auto justify-center">
                    {cargando ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
                    {editandoId ? 'Actualizar Producto' : 'Guardar en Catálogo'}
                  </button>
                </div>
              </form>
            </div>

            {/* SECCIÓN 2: LA LISTA DE PRODUCTOS */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-[#4A2B50] mb-6">📦 Productos en el Menú ({productos.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-xl">Foto</th>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">Precio Desde</th>
                      <th className="px-4 py-3">Opciones</th>
                      <th className="px-4 py-3 rounded-tr-xl text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productos.length === 0 ? (
                      <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-400">No hay productos guardados aún.</td></tr>
                    ) : (
                      productos.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3"><img src={prod.imagen} alt={prod.nombre} className="w-12 h-12 object-cover rounded-lg shadow-sm border border-slate-200" /></td>
                          <td className="px-4 py-3 font-medium text-slate-800">{prod.nombre}</td>
                          <td className="px-4 py-3 font-bold text-emerald-600">${prod.precio}</td>
                          <td className="px-4 py-3 text-xs">
                            <span className="bg-[#F5EEFD] text-[#4A2B50] px-2 py-1 rounded font-bold">
                              {prod.presentaciones ? prod.presentaciones.length : 1} pres.
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button onClick={() => prepararEdicion(prod)} className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"><i className="fa-solid fa-pen"></i></button>
                            <button onClick={() => eliminarProducto(prod.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"><i className="fa-solid fa-trash"></i></button>
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
        
        {seccionActiva === 'cotizador' && (
          <Cotizador />
        )}
      </main>
    </div>
  );
}

export default Admin;

