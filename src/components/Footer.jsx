import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#F5EEFD] mt-auto pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 text-center md:text-left">
          
          {/* Ubicación y Dinámica */}
          <div>
            <h4 className="text-[11px] font-black text-[#4A2B50] uppercase tracking-widest mb-4 flex items-center justify-center md:justify-start gap-2">
              <i className="fa-solid fa-location-dot"></i> Entregas
            </h4>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              MoniMila Bakery opera exclusivamente sobre pedido.<br />
              Entregas coordinadas en <span className="font-bold text-[#4A2B50]">CDMX</span> y área metropolitana.
            </p>
          </div>

          {/* Contacto WhatsApp */}
          <div>
            <h4 className="text-[11px] font-black text-[#4A2B50] uppercase tracking-widest mb-4 flex items-center justify-center md:justify-start gap-2">
              <i className="fa-brands fa-whatsapp text-lg"></i> Pedidos Directos
            </h4>
            <a href="https://wa.me/525500000000" target="_blank" rel="noreferrer" className="inline-block text-sm font-medium text-slate-600 hover:text-[#4A2B50] transition-colors bg-[#F5EEFD] px-4 py-2 rounded-lg">
              Enviar mensaje a WhatsApp
            </a>
          </div>

          {/* La Fusión de Dos Mundos */}
          <div>
            <h4 className="text-[11px] font-black text-[#4A2B50] uppercase tracking-widest mb-4 flex items-center justify-center md:justify-start gap-2">
              <i className="fa-solid fa-wand-magic-sparkles"></i> Innovación
            </h4>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              Tradición horneada en casa fusionada con tecnología. <br/>
              Figuras temáticas exclusivas impresas en 3D con precisión de nivel <span className="italic">Flashforge AD5X</span> para nuestras Roscas de Reyes.
            </p>
          </div>

        </div>
        
        <div className="pt-6 border-t border-[#F5EEFD] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[11px] font-medium text-slate-400">
            © {currentYear} MoniMila Bakery. Bocadito para el alma.
          </div>
          <div className="text-[10px] text-[#4A2B50] font-black uppercase tracking-widest bg-[#F5EEFD] px-3 py-1 rounded-full">
            Artesanal & 3D
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
