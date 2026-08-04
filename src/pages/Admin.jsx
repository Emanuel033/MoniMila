import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import Cotizador from './Cotizador';


function Admin() {
  const [seccionActiva, setSeccionActiva] = useState('catalogo');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  
  // Estados para el formulario (CRUD)
  const [editandoId, setEditandoId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [imagenBase64, setImagenBase64] = useState('');
  const [nombreArchivo, setNombreArchivo] = useState('');

  // LEER: Cargar productos en tiempo real desde Firestore
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

  // MOTOR DE COMPRESIÓN: Reduce la foto del celular para que Firestore la acepte
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
        const MAX_WIDTH = 800; // Tamaño Canva
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        // Mantener proporciones
        if (width > height && width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        } else if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a JPEG comprimido (70% calidad) para evitar el error invalid-argument
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setImagenBase64(dataUrl);
      };
    };
  };

  // CREAR Y ACTUALIZAR
  const guardarProducto = async (e) => {
    e.preventDefault();
    if (!nombre || !precio) {
      alert("Por favor completa el nombre y el precio.");
      return;
    }

    try {
      setCargando(true);
      const datosProducto = {
        nombre: nombre || '',
        descripcion: descripcion || '',
        precio: parseFloat(precio) || 0,
        categoria: categoria || 'General',
        subcategoria: subcategoria || '',
        imagen: imagenBase64 || 'https://via.placeholder.com/800',
        fechaModificacion: new Date()
      };

      if (editandoId) {
        // Actualizar producto existente
        await updateDoc(doc(db, "productos", editandoId), datosProducto);
        setMensaje("¡Postre actualizado correctamente! ✏️");
      } else {
        // Crear nuevo producto
        datosProducto.fechaCreacion = new Date();
        await addDoc(collection(db, "productos"), datosProducto);
        setMensaje("¡Nuevo postre agregado al menú! 🎉");
      }

      limpiarFormulario();
    } catch (error) {
      console.error("Error Firestore:", error);
      alert("Hubo un error al guardar: " + error.message);
    } finally {
      setCargando(false);
      setTimeout(() => setMensaje(''), 4000);
    }
  };

  // ELIMINAR
  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este postre del catálogo?")) {
      await deleteDoc(doc(db, "productos", id));
    }
  };

  // PREPARAR PARA EDITAR
  const prepararEdicion = (producto) => {
    setEditandoId(producto.id);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setPrecio(producto.precio);
    setCategoria(producto.categoria);
    setSubcategoria(producto.subcategoria);
    setImagenBase64(producto.imagen);
    setNombreArchivo('Imagen existente cargada');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube la pantalla al formulario
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setCategoria('');
    setSubcategoria('');
    setImagenBase64('');
    setNombreArchivo('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Menú Lateral */}
      <aside className="w-full md:w-64 bg-[#4A2B50] text-white flex flex-col shadow-xl">
        <div className="p-6 text-center border-b border-white/10">
          <h2 className="text-2xl font-serif font-bold text-[#F5EEFD]">MoniMila</h2>
          <span className="text-xs tracking-widest opacity-70 uppercase">Administración</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setSeccionActiva('catalogo')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/20 font-bold"
          >
            <i className="fa-solid fa-cake-candles w-5"></i> Gestión del Menú
          </button>
          <button 
  onClick={() => setSeccionActiva('cotizador')}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${seccionActiva === 'cotizador' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
>
  <i className="fa-solid fa-calculator w-5"></i> Cotizador Inteligente
</button>

        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {seccionActiva === 'catalogo' && (
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* SECCIÓN 1: EL FORMULARIO (Crear/Editar) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#4A2B50]">
                    {editandoId ? '✏️ Editando Postre' : '✨ Agregar Nuevo Postre'}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    {editandoId ? 'Modifica los detalles y guarda los cambios.' : 'Sube una foto y llena los detalles para el catálogo.'}
                  </p>
                </div>
                {editandoId && (
                  <button onClick={limpiarFormulario} className="text-sm bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-bold hover:bg-slate-200">
                    Cancelar Edición
                  </button>
                )}
              </div>
              
              {mensaje && (
                <div className="mb-6 bg-emerald-100 border border-emerald-300 text-emerald-800 px-6 py-4 rounded-2xl font-bold flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-xl"></i> {mensaje}
                </div>
              )}

              <form onSubmit={guardarProducto} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Precio ($)</label>
                    <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                  <textarea rows="2" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]"></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría (Libre)</label>
                    {/* DataList para permitir sugerencias pero dejar escribir libremente */}
                    <input list="categorias-sugeridas" value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Ej. Alfajores, Roscas..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]" />
                    <datalist id="categorias-sugeridas">
                      <option value="Alfajores" />
                      <option value="Roscas" />
                      <option value="Pasteles" />
                      <option value="Temporada" />
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subcategoría (Opcional)</label>
                    <input type="text" value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)} placeholder="Ej. Docena, Individual..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Foto (Se comprime automáticamente)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-[#F5EEFD] transition-colors relative cursor-pointer flex flex-col items-center justify-center">
                    <input type="file" accept="image/*" onChange={manejarImagen} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    {imagenBase64 ? (
                      <img src={imagenBase64} alt="Previsualización" className="h-24 w-24 object-cover rounded-xl mb-2 shadow-sm" />
                    ) : (
                      <i className="fa-solid fa-image text-3xl mb-2 text-slate-400"></i>
                    )}
                    <p className="text-sm font-medium text-slate-600">
                      {nombreArchivo ? `Foto: ${nombreArchivo}` : 'Toca para seleccionar desde tu galería'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button type="submit" disabled={cargando} className="bg-[#4A2B50] hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2">
                    {cargando ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
                    {editandoId ? 'Actualizar Producto' : 'Guardar Nuevo Producto'}
                  </button>
                </div>
              </form>
            </div>

            {/* SECCIÓN 2: LA LISTA DE PRODUCTOS (Leer, Editar, Eliminar) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-[#4A2B50] mb-6">📦 Productos en el Menú ({productos.length})</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-xl">Foto</th>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">Precio</th>
                      <th className="px-4 py-3">Categoría</th>
                      <th className="px-4 py-3 rounded-tr-xl text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productos.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-slate-400">No hay productos guardados aún.</td>
                      </tr>
                    ) : (
                      productos.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <img src={prod.imagen} alt={prod.nombre} className="w-12 h-12 object-cover rounded-lg shadow-sm border border-slate-200" />
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-800">{prod.nombre}</td>
                          <td className="px-4 py-3 font-bold text-emerald-600">${prod.precio}</td>
                          <td className="px-4 py-3 text-xs bg-slate-100 rounded-md px-2 py-1 inline-block mt-3">{prod.categoria}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button onClick={() => prepararEdicion(prod)} className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button onClick={() => eliminarProducto(prod.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
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
        {seccionActiva === 'cotizador' && (
  <Cotizador />
)}

      </main>
    </div>
  );
}

export default Admin;
