import React from 'react';
import ProductCard from './ProductCard'; 
import { useApp } from '../context/AppContext';

function ProductGrid() {
  // Traemos los datos listos desde tu contexto global
  const { productos, cargando, categoriaActiva } = useApp(); 

  // Filtramos usando la variable global
  const productosFiltrados = categoriaActiva === 'Todos' 
    ? productos 
    : productos.filter(p => p.categoria === categoriaActiva);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {cargando ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <i className="fa-solid fa-spinner animate-spin text-4xl mb-4 text-[#4A2B50]"></i>
          <p className="font-medium text-lg">Horneando el catálogo...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <i className="fa-solid fa-cookie-bite text-5xl text-slate-300 mb-4"></i>
          <h3 className="font-bold text-[#4A2B50] text-xl">Aún no hay postres</h3>
          <p className="text-slate-500 mt-2">Ve al panel de administrador para agregar tu primer producto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productosFiltrados.map((prod) => (
            <ProductCard key={prod.id} producto={prod} />
          ))}
          
          {productosFiltrados.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-500">
              No hay productos en la categoría "{categoriaActiva}" por el momento.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
