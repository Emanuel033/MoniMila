import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function Navbar() {
  const { toggleCart, totalPiezas } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Menú', path: '/catalogo' },
    { name: 'Nosotros', path: '/nosotros' }
  ];


  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-[#F5EEFD] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20 items-center">
          
          {/* Logo y Nombre */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            {/* Asegúrate de que tu logo esté en la carpeta public como logo.png */}
            <img src="/logo.png" alt="MoniMila Bakery" className="h-10 w-auto object-contain" onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }} />
            <span className="font-serif font-bold text-xl text-[#4A2B50] hidden">MoniMila</span>
          </Link>

          {/* Menú de Escritorio */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors ${
                  isActive(link.path) 
                    ? 'border-[#4A2B50] text-[#4A2B50]' 
                    : 'border-transparent text-slate-500 hover:text-[#4A2B50] hover:border-[#E8D8F8]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Botón del Carrito */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleCart}
              className="relative p-2 text-[#4A2B50] hover:bg-[#F5EEFD] rounded-full transition-colors flex items-center justify-center"
            >
              <i className="fa-solid fa-basket-shopping text-xl"></i>
              {totalPiezas > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {totalPiezas}
                </span>
              )}
            </button>

            {/* Menú Hamburguesa Móvil */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-[#4A2B50]"
            >
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#F5EEFD] absolute w-full shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block pl-3 pr-4 py-3 border-l-4 text-base font-bold ${
                  isActive(link.path)
                    ? 'bg-[#F5EEFD] border-[#4A2B50] text-[#4A2B50]'
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-[#4A2B50]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
