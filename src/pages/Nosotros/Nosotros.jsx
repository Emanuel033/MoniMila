
import React from 'react';

function Nosotros() {
  return (
    <div className="min-h-screen bg-white text-[#4A2B50] py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Historia */}
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'serif' }}>Nuestra Historia</h1>
          <p className="text-lg leading-relaxed bg-[#F5EEFD] p-8 rounded-3xl shadow-sm text-slate-700">
            MoniMila Bakery nace como un homenaje al amor, la tradición y la familia. Inspirados en la calidez de nuestros padres, creamos este espacio para compartir el sabor de los postres hechos en casa. Cada alfajor y cada pan está elaborado con la misma dedicación con la que se preparan las sorpresas para los seres queridos.
          </p>
        </section>

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-[#E8D8F8] bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-[#4A2B50]" style={{ fontFamily: 'serif' }}>Misión</h2>
            <p className="text-slate-600">
              Brindar "un bocadito para el alma" a través de postres artesanales de la más alta calidad, fusionando la repostería clásica con toques de innovación personalizada para hacer de cada celebración un momento inolvidable.
            </p>
          </div>
          <div className="border border-[#E8D8F8] bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-[#4A2B50]" style={{ fontFamily: 'serif' }}>Visión</h2>
            <p className="text-slate-600">
              Convertirnos en la panadería artesanal sobre pedido favorita de nuestra comunidad, reconocida por nuestro sabor inconfundible y por revolucionar las tradiciones, como nuestras icónicas Roscas de Reyes con figuras exclusivas.
            </p>
          </div>
        </div>

        {/* Valores */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'serif' }}>Nuestros Valores</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <li className="bg-[#4A2B50] text-[#E8D8F8] p-6 rounded-2xl shadow-md">
              <strong className="block text-xl mb-2 text-white font-serif">Calidez Familiar</strong>
              <span className="text-sm">Tratamos cada pedido como si fuera para nuestra propia mesa.</span>
            </li>
            <li className="bg-[#4A2B50] text-[#E8D8F8] p-6 rounded-2xl shadow-md">
              <strong className="block text-xl mb-2 text-white font-serif">Innovación</strong>
              <span className="text-sm">Llevamos la tecnología y el diseño a la repostería tradicional.</span>
            </li>
            <li className="bg-[#4A2B50] text-[#E8D8F8] p-6 rounded-2xl shadow-md">
              <strong className="block text-xl mb-2 text-white font-serif">Calidad Artesanal</strong>
              <span className="text-sm">Ingredientes seleccionados y procesos sumamente meticulosos.</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}

export default Nosotros;
