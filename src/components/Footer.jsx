import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#4A2B50] text-[#F5EEFD] pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Columna 1: Marca y Eslogan */}
          <div>
            <h3 className="text-2xl font-serif font-bold text-white mb-4">MoniMila Bakery</h3>
            <p className="text-[#E8D8F8] italic mb-4">"Bocaditos para el alma."</p>
            <p className="text-sm text-[#E8D8F8] opacity-80 leading-relaxed">
              Repostería artesanal inspirada en el amor, las enseñanzas y el legado de nuestra familia.
            </p>
          </div>

          {/* Columna 2: La nueva sección de Innovación/Esencia */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Tradición y Creatividad</h4>
            <p className="text-sm text-[#E8D8F8] leading-relaxed">
              Fusionamos las recetas clásicas con detalles únicos. Nuestras creaciones de temporada, como las Roscas, esconden sorpresas temáticas de diseño exclusivo para que cada celebración sea inolvidable sin perder la calidez de lo hecho en casa.
            </p>
          </div>

          {/* Columna 3: Enlaces y Redes */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Explora</h4>
            <ul className="space-y-2 mb-6 text-sm text-[#E8D8F8]">
              <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/catalogo" className="hover:text-white transition-colors">Menú</Link></li>
              <li><Link to="/nosotros" className="hover:text-white transition-colors">Nuestra Historia</Link></li>
            </ul>
            
            {/* Íconos de Redes Sociales */}
            <div className="flex gap-4 text-xl">
              <a href="#" className="hover:text-[#E8D8F8] text-white transition-transform hover:scale-110">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-[#E8D8F8] text-white transition-transform hover:scale-110">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#" className="hover:text-[#E8D8F8] text-white transition-transform hover:scale-110">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="border-t border-[#E8D8F8]/20 pt-8 text-center text-xs text-[#E8D8F8] opacity-60">
          <p>&copy; {new Date().getFullYear()} MoniMila Bakery. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
