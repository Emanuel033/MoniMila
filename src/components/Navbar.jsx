import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar'; 


function Navbar() {
  return (
    <nav className="bg-[#4A2B50] text-white sticky top-0 z-40 shadow-lg" id="main-nav">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Lado Izquierdo: Logotipo y Marca */}
        <Link to="/" className="flex items-center justify-center md:justify-start gap-3.5 hover:opacity-90 transition-opacity w-full md:w-auto cursor-pointer">
          <div className="h-12 w-12 flex items-center justify-center bg-[#E8D8F8] rounded-full shadow-sm p-1 overflow-hidden shrink-0 border border-[#F5EEFD]">
            {/* Recuerda poner tu imagen del logo lila en la carpeta public */}
            <img 
              src="/logo.png" 
              alt="Logo MoniMila Bakery" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="flex flex-col text-center md:text-left">
            <h1 className="text-[18px] font-bold tracking-wide text-white leading-tight" style={{ fontFamily: 'serif' }}>MoniMila Bakery</h1>
            <p className="text-[11px] text-[#E8D8F8] font-medium tracking-widest italic uppercase">Bocadito para el alma</p>
          </div>
        </Link>

        {/* Lado Derecho: Enlaces de Navegación */}
        <div className="w-full md:w-auto flex justify-center gap-6 text-sm font-semibold tracking-wide">
          <Link to="/" className="hover:text-[#E8D8F8] transition-colors border-b-2 border-transparent hover:border-[#E8D8F8] pb-1">
            Inicio
          </Link>
          <Link to="/catalogo" className="hover:text-[#E8D8F8] transition-colors border-b-2 border-transparent hover:border-[#E8D8F8] pb-1">
            Catálogo
          </Link>
          <Link to="/nosotros" className="hover:text-[#E8D8F8] transition-colors border-b-2 border-transparent hover:border-[#E8D8F8] pb-1">
            Nuestra Historia
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
