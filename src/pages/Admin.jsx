import React, { useState } from 'react';
import { db, storage } from '../firebase'; // Importamos tu conexión
import { collection, addDbDoc, addDoc } from 'firebase/firestore'; // Ojo: usamos addDoc
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function Admin() {
  const [modoPruebas, setModoPruebas] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState('dashboard');
  
  // Estados para el formulario de productos
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Alfajores');
  const [subcategoria, setSubcategoria] = useState('');
  const [imagen, setImagen] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // Función para guardar el producto en Firebase
  const guardarProducto = async (e) => {
    e.preventDefault();
    if (!nombre || !precio || !imagen) {
      alert("Por favor completa los campos obligatorios y selecciona una imagen.");
      return;
    }

    try {
      setCargando(true);
      
      // 1. Subir la imagen a Firebase Storage
      const storageRef = ref(storage, `productos/${Date.now()}_${imagen.name}`);
      const snapshot = await uploadBytes(storageRef, imagen);
      const urlImagen = await getDownloadURL(snapshot.ref);

      // 2. Guardar los datos del producto en Firestore (Base de datos)
      await addDoc(collection(db, "productos"), {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        categoria,
        subcategoria,
        imagen: urlImagen,
        creado: new Date()
      });

      setCargando(false);
      setMensajeExito("¡Postre guardado con éxito en el catálogo! 🎉");
      
      // Limpiar formulario
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setSubcategoria('');
      setImagen(null);

      setTimeout(() => setMensajeExito(''), 4000);

    } catch (error) {
      console.error("Error al guardar el producto: ", error);
      setCargando(false);
      alert("Hubo un error al subir el producto. Revisa tu conexión.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Menú Lateral */}
      <aside className="w-full md:w-64 bg-[#4A2B50] text-white flex flex-col shadow-xl">
        <div className="p-6 text-center border-b border-white/10">
          <h2 className="text-2xl font-serif font-bold text-[#F5EEFD]">MoniMila</h2>
          <span className="text-xs tracking-widest opacity-70 uppercase">Panel Interno</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setSeccionActiva('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${seccionActiva === 'dashboard' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
          >
            <i className="fa-solid fa-chart-line w-5"></i> Métricas y Estrellas
          </button>
          <button 
            onClick={() => setSeccionActiva('catalogo')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${seccionActiva === 'catalogo' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
          >
            <i className="fa-solid fa-cake-candles w-5"></i> Gestionar Menú
          </button>
          <button 
            onClick={() => setSeccionActiva('historial')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${seccionActiva === 'historial' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
          >
            <i className="fa-solid fa-receipt w-5"></i> Historial de Ventas
          </button>
        </nav>

        {/* Interruptor de Modo Pruebas */}
        <div className="p-6 border-t border-white/10">
          <div className="bg-black/20 rounded-2xl p-4">
            <p className="text-xs font-bold uppercase mb-3 opacity-80 text-center">Registro de Ventas</p>
            <button 
              onClick={() => setModoPruebas(!modoPruebas)}
              className={`w-full py-2 px-4 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 ${modoPruebas ? 'bg-amber-400 text-amber-900' : 'bg-emerald-400 text-emerald-900'}`}
            >
              <i className={`fa-solid ${modoPruebas ? 'fa-triangle-exclamation' : 'fa-check'}`}></i>
              {modoPruebas ? 'Modo Pruebas (Pausado)' : 'Activo (Registrando)'}
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {seccionActiva === 'dashboard' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-serif font-bold text-[#4A2B50]">Tus Productos Estrella 🌟</h1>
            <p className="text-slate-500 text-sm">Descubre qué postres mantener siempre en inventario basándote en el historial de ventas.</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
                <span className="bg-amber-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-3 shadow-md">1</span>
                <h3 className="font-bold text-[#4A2B50] text-lg">Docena Alfajores Clásicos</h3>
                <p className="text-sm text-slate-600 mt-1">45 pedidos este mes</p>
                <span className="mt-4 text-xs font-bold text-amber-700 bg-amber-200 px-3 py-1 rounded-full">Producir Siempre</span>
              </div>
              <div className="bg-gradient-to-br from-slate-100 to-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
                <span className="bg-slate-300 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold mb-3 shadow-md">2</span>
                <h3 className="font-bold text-[#4A2B50] text-lg">Rosca Individual c/ Figura</h3>
                <p className="text-sm text-slate-600 mt-1">28 pedidos este mes</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <span className="text-indigo-600 font-bold mb-2 uppercase text-xs tracking-wider">Lanzamiento de Prueba</span>
                <h3 className="font-bold text-[#4A2B50] text-lg">Alfajor de Nuez</h3>
                <p className="text-sm text-slate-600 mt-1">12 pedidos (Semana 1)</p>
                <p className="text-[11px] text-indigo-500 mt-3 font-medium">Buena recepción. Evaluar dejarlo fijo.</p>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 2: Gestión del Menú (CRUD conectado a Firebase) */}
        {seccionActiva === 'catalogo' && (
          <div className="max-w-3xl">
            <h1 className="text-3xl font-serif font-bold text-[#4A2B50] mb-2">Agregar Nuevo Postre</h1>
            <p className="text-slate-500 text-sm mb-6">Sube un nuevo producto al catálogo directamente a la nube.</p>
            
            {mensajeExito && (
              <div className="mb-6 bg-emerald-100 border border-emerald-300 text-emerald-800 px-6 py-4 rounded-2xl font-bold flex items-center gap-3">
                <i className="fa-solid fa-circle-check text-xl"></i> {mensajeExito}
              </div>
            )}

            <form onSubmit={guardarProducto} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Postre</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Alfajor de Nuez" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Precio de Venta ($)</label>
                  <input 
                    type="number" 
                    placeholder="Ej. 35" 
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción que enamore</label>
                <textarea 
                  rows="3" 
                  placeholder="Describe los sabores, la textura..." 
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]"
                ></textarea>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría Principal</label>
                  <select 
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]"
                  >
                    <option value="Alfajores">Alfajores</option>
                    <option value="Roscas">Roscas</option>
                    <option value="Temporada">Temporada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subcategoría / Presentación</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Individual, Docena, Mini..." 
                    value={subcategoria}
                    onChange={(e) => setSubcategoria(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A2B50]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Foto del Producto</label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-[#F5EEFD] transition-colors relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImagen(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <i className="fa-solid fa-image text-3xl mb-2 text-slate-400"></i>
                  <p className="text-sm font-medium text-slate-600">
                    {imagen ? `📁 Seleccionado: ${imagen.name}` : 'Toca para seleccionar una foto de tu tablet'}
                  </p>
                  <p className="text-xs text-indigo-600 font-bold bg-indigo-50 inline-block px-3 py-1 rounded-full mt-2">
                    Tip para Canva: Tamaño sugerido 800 x 800 px (Cuadrado)
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button 
                  type="submit" 
                  disabled={cargando}
                  className="bg-[#4A2B50] hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {cargando ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
                  {cargando ? 'Guardando en la nube...' : 'Guardar en el Menú'}
                </button>
              </div>
            </form>
          </div>
        )}

        {seccionActiva === 'historial' && (
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#4A2B50] mb-2">Historial de Ventas</h1>
            <p className="text-slate-500 text-sm mb-6">Revisa todos los pedidos confirmados.</p>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Producto</th>
                    <th className="px-6 py-4">Cantidad</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4">Hoy, 10:30 AM</td>
                    <td className="px-6 py-4 font-medium text-[#4A2B50]">Docena Alfajores</td>
                    <td className="px-6 py-4">2</td>
                    <td className="px-6 py-4">$840.00</td>
                    <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Entregado</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;

