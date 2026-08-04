import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Revisa que la ruta a tu firebase.js sea correcta
import { collection, onSnapshot } from 'firebase/firestore';
import ProductCard from './ProductCard'; // Asegúrate de que la ruta coincida

function ProductGrid() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Escuchar en tiempo real los productos de Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "productos"), (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProductos(lista);
      setCargando(false);
    });
    
    // Limpieza de seguridad
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {cargando ? (
        // Pantalla de carga mientras trae los datos
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <i className="fa-solid fa-spinner animate-spin text-4xl mb-4 text-[#4A2B50]"></i>
          <p className="font-medium text-lg">Horneando el catálogo...</p>
        </div>
      ) : productos.length === 0 ? (
        // Por si borras todo y queda vacío
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <i className="fa-solid fa-cookie-bite text-5xl text-slate-300 mb-4"></i>
          <h3 className="font-bold text-[#4A2B50] text-xl">Aún no hay postres</h3>
          <p className="text-slate-500 mt-2">Ve al panel de administrador para agregar tu primer producto.</p>
        </div>
      ) : (
        // Cuadrícula de productos dinámica
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((prod) => (
            <ProductCard key={prod.id} producto={prod} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
