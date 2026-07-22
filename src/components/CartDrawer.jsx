import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function CartDrawer() {
  const { 
    isCartOpen, toggleCart, carrito, totalPiezas, clearCart,
    agregarAlCarrito, quitarDelCarrito, eliminarProducto, productos 
  } = useApp();

  const [clientName, setClientName] = useState('');
  const [indicaciones, setIndicaciones] = useState('');

  // Lógica para enviar por WhatsApp
  const handleSendWhatsApp = () => {
    // Aquí puedes poner el número de WhatsApp de MoniMila Bakery
    const numeroMoniMila = "525577937318"; 
    
    let textoMensaje = `Hola MoniMila Bakery 💜, soy ${clientName || 'un cliente'}.\nMe encantaría hacer el siguiente pedido:\n\n`;
    
    let totalPrecio = 0;

    carrito.forEach((item) => {
      const prod = productos.find(p => p.id === item.id) || item;
      const subtotal = prod.precio * item.cantidad;
      totalPrecio += subtotal;
      textoMensaje += `- ${item.cantidad}x ${prod.name} ($${subtotal} MXN)\n`;
    });
    
    textoMensaje += `\n*Total estimado: $${totalPrecio} MXN*`;

    if (indicaciones) {
        textoMensaje += `\n\n*Indicaciones especiales:* ${indicaciones}`;
    }
    
    const urlWhatsApp = `https://wa.me/${numeroMoniMila}?text=${encodeURIComponent(textoMensaje)}`;
    window.open(urlWhatsApp, "_blank");
  };

  return (
    <div className={`fixed inset-0 z-50 ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div 
        onClick={toggleCart}
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} 
      />
      
      <div className={`absolute right-0 top-0 h-full w-full md:w-[480px] bg-slate-50 shadow-2xl flex flex-col transform transition-transform duration-500 ease-out md:rounded-l-[2rem] overflow-hidden ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Encabezado */}
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F5EEFD] flex items-center justify-center text-[#4A2B50]">
              <i className="fa-solid fa-basket-shopping"></i>
            </div>
            <h2 className="text-xl font-bold font-serif text-[#4A2B50]">Tu Pedido</h2>
          </div>
          <button onClick={toggleCart} className="text-slate-400 hover:text-red-500 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto bg-[#F5EEFD]/30 relative p-4 space-y-3">
          {carrito.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 m-4 py-20">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 text-[#E8D8F8] shadow-sm">
                <i className="fa-solid fa-cookie-bite text-3xl"></i>
              </div>
              <p className="text-sm font-bold text-slate-500">Tu caja está vacía</p>
            </div>
          ) : (
            <>
              {carrito.map((item) => {
                const prod = productos.find(p => p.id === item.id) || item;
                return (
                  <div key={item.id} className="flex gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm mb-3 relative">
                    <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-50 p-1 flex items-center justify-center overflow-hidden">
                      <img src={prod.image} alt={prod.name} className="h-full w-full object-cover rounded-md" onError={(e) => e.target.src='https://via.placeholder.com/60'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">{prod.name}</h4>
                        <button onClick={() => eliminarProducto(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1"><i className="fa-solid fa-trash-can"></i></button>
                      </div>
                      <p className="text-xs text-[#4A2B50] font-bold mt-1">${prod.precio} MXN</p>
                      
                      <div className="flex justify-end mt-2">
                        <div className="flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-1.5 w-32">
                          <button onClick={() => quitarDelCarrito(item.id)} className="px-2 text-slate-500 font-bold">-</button>
                          <span className="w-full text-center font-bold text-slate-800">{item.cantidad}</span>
                          <button onClick={() => agregarAlCarrito(prod, 1)} className="px-2 text-[#4A2B50] font-bold">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Formulario de Checkout Corto */}
              <div className="mt-4 p-5 bg-white border border-slate-200 rounded-xl mb-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Nombre del Cliente</label>
                <div className="relative mb-4">
                    <i className="fa-regular fa-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="¿A nombre de quién?" className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#4A2B50] focus:ring-1 focus:ring-[#E8D8F8] transition" />
                </div>
                
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Indicaciones Especiales</label>
                <textarea 
                  value={indicaciones} 
                  onChange={(e) => setIndicaciones(e.target.value)} 
                  placeholder="Ej: Para el alfajor quiero coco rallado..." 
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#4A2B50] focus:ring-1 focus:ring-[#E8D8F8] transition"
                  rows="2"
                ></textarea>
              </div>
            </>
          )}
        </div>

        {/* Footer del Carrito */}
        <div className="px-6 py-5 border-t border-slate-200/50 bg-white shrink-0 z-20 w-full shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between mb-4 items-end">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Total Productos</span>
            <span className="text-3xl font-black text-[#4A2B50] leading-none tracking-tighter">
              {totalPiezas}
            </span>
          </div>
          
          <button 
            onClick={handleSendWhatsApp}
            disabled={carrito.length === 0}
            className="w-full h-12 bg-[#4A2B50] disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-md transition-all hover:bg-opacity-90 active:scale-95 flex items-center justify-center gap-2"
          >
            <i className="fa-brands fa-whatsapp text-lg"></i> 
            <span>Pedir por WhatsApp</span>
          </button>
          
          <div className="text-center mt-3">
            <button onClick={clearCart} className="text-slate-400 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest py-1 transition">
              Vaciar Carrito
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default CartDrawer;
