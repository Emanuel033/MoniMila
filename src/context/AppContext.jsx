import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState(['Todos']);
  const [cargando, setCargando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Recuperar carrito del navegador
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem('carrito_monimila');
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch (error) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('carrito_monimila', JSON.stringify(carrito));
  }, [carrito]);

  // Cargar el catálogo (Asegúrate de tener un archivo catalogo.json en tu carpeta public)
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('/catalogo.json');
        if (!response.ok) throw new Error("Archivo JSON no encontrado");
        
        const productosData = await response.json();
        
        setProductos(productosData);
        
        // Extraer categorías únicas
        let uniqueCats = [...new Set(productosData.map(p => p.category || 'Postres'))];
        uniqueCats = uniqueCats.filter(c => c.toLowerCase() !== 'todos').sort();
        setCategorias(['Todos', ...uniqueCats]);
        
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar menú:", error);
        setCargando(false);
      }
    };
    fetchProductos();
  }, []);

  const seleccionarCategoria = (nuevaCategoria) => {
    setCategoriaActiva(nuevaCategoria);
    setSearchTerm('');      
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const clearCart = () => { if(window.confirm('¿Deseas vaciar tu caja de postres?')) setCarrito([]); };

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito((prev) => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item);
      return [...prev, { ...producto, cantidad }];
    });
    setIsCartOpen(true); // Abre el carrito automáticamente al agregar
  };

  const eliminarProducto = (id) => setCarrito(prev => prev.filter(item => item.id !== id));
  
  const totalPiezas = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <AppContext.Provider value={{ 
      productos, categorias, cargando, categoriaActiva, setCategoriaActiva,
      searchTerm, setSearchTerm, seleccionarCategoria, 
      carrito, isCartOpen, setIsCartOpen, toggleCart, clearCart, 
      agregarAlCarrito, eliminarProducto, totalPiezas
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
