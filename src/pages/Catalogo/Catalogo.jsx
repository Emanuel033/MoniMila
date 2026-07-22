import React from 'react';
import CategoriesBar from '../../components/CategoriesBar';
import ProductGrid from '../../components/ProductGrid';
import FloatingButtons from '../../components/FloatingButtons';
import CartDrawer from '../../components/CartDrawer';
// Ya no necesitamos el Admin, pero conservamos el contexto para el Carrito
import { useApp } from '../../context/AppContext'; 

function Catalogo() {
  return (
    <div className="bg-[#F5EEFD] font-sans text-[#4A2B50] flex flex-col min-h-screen relative overflow-x-hidden">
      
      {/* Encabezado sencillo para el catálogo */}
      <header className="pt-8 pb-4 text-center px-4">
        <h1 className="text-3xl font-bold font-serif mb-2 text-[#4A2B50]">Menú MoniMila</h1>
        <p className="text-slate-600 italic">Descubre nuestros postres artesanales sobre pedido</p>
      </header>

      <CategoriesBar />
       
      <main className="flex-grow max-w-7xl mx-auto px-4 py-6 w-full">
        {/* Aquí se mostrarán los alfajores y postres */}
        <ProductGrid />
      </main>

      <CartDrawer />
      <FloatingButtons />

    </div>
  );
}

export default Catalogo;
