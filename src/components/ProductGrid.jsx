import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard'; // Asegúrate de tener este archivo
import { useApp } from '../context/AppContext';

function ProductGrid() {
  const { productos, cargando, categoriaActiva, searchTerm, setSearchTerm } = useApp();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [categoriaActiva, searchTerm]);

  if (cargando) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="w-10 h-10 border-4 border-[#E8D8F8] border-t-[#4A2B50] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium font-serif">Horneando menú...</p>
      </div>
    );
  }

  const termino = (searchTerm || '').toLowerCase().trim();
  const catActiva = (categoriaActiva || 'Todos').toLowerCase().trim();
  
  let productosBase = (productos || []).filter(p => {
    const categoriaProducto = (p.category || '').toLowerCase();
    const nombreProducto = (p.name || '').toLowerCase();

    const coincideCategoria = catActiva === 'todos' || categoriaProducto === catActiva;
    const coincideBusqueda = termino === '' || nombreProducto.includes(termino);
    
    return coincideCategoria && coincideBusqueda;
  });

  const productosFiltrados = productosBase.sort((a, b) => {
    const nameA = a.name || '';
    const nameB = b.name || '';
    return nameA.localeCompare(nameB);
  });

  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = productosFiltrados.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <div className="flex flex-col space-y-4">
      
      {productosFiltrados.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-5">
            <i className="fa-solid fa-cookie-bite text-3xl text-[#E8D8F8]"></i>
          </div>
          <h3 className="text-xl font-bold font-serif text-[#4A2B50] mb-2 text-center">
            ¡Ups! No encontramos ese postre
          </h3>
          <p className="text-sm text-slate-500 max-w-md text-center mb-8">
            No hay productos en "{categoriaActiva}" que coincidan con tu búsqueda.
          </p>
          
          <button
            onClick={() => {
              setSearchTerm('');
            }}
            className="bg-[#F5EEFD] text-[#4A2B50] hover:bg-[#E8D8F8] px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <i className="fa-solid fa-eraser"></i> Limpiar búsqueda
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
            {currentProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8 pb-8">
              <button 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full border border-[#E8D8F8] flex items-center justify-center text-[#4A2B50] disabled:opacity-30 bg-white shadow-sm"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              
              <span className="text-sm font-bold text-slate-600 px-4 font-serif">
                Página {currentPage} de {totalPages}
              </span>

              <button 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full border border-[#E8D8F8] flex items-center justify-center text-[#4A2B50] disabled:opacity-30 bg-white shadow-sm"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductGrid;
