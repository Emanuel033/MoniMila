
import React from 'react';

function Nosotros() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      
      {/* Encabezado / Hero */}
      <header className="bg-[#F5EEFD] py-20 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#4A2B50] font-black uppercase tracking-[0.3em] text-[10px] bg-white px-4 py-1.5 rounded-full shadow-sm">
            Nuestra Esencia
          </span>
          <h1 className="mt-8 text-4xl md:text-5xl font-serif font-bold text-[#4A2B50] leading-tight">
            Monimila Bakery
          </h1>
          <p className="mt-6 text-xl text-slate-600 font-medium italic">
            "Bocaditos para el alma."
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        
        {/* Sección Historia */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 mb-12">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="w-48 h-48 bg-[#F5EEFD] rounded-full flex items-center justify-center text-[#4A2B50] text-6xl shadow-inner">
                <i className="fa-solid fa-heart"></i>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-serif font-bold text-[#4A2B50] mb-6 border-b border-[#F5EEFD] pb-4">
                Nuestra Historia
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Monimila Bakery nació como un homenaje a las personas que sembraron en mí el amor por la cocina: mis abuelos, <strong className="text-[#4A2B50]">Manuel y Edelmira</strong>. A Manuel todos le decían "Moni" y a Edelmira, "Mila". De la unión de sus nombres surgió Monimila, un símbolo de sus enseñanzas, su cariño y el hermoso legado que dejaron en nuestra familia.
                </p>
                <p>
                  Hace algunos años comencé este proyecto elaborando alfajores con la ilusión de crear postres que transmitieran emociones. Tras una pausa para dedicarme a mis estudios y prácticas profesionales, el deseo de regresar a la cocina nunca desapareció. Hoy, Monimila Bakery renace con más experiencia, nuevos sueños y el mismo amor de siempre por la repostería.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Filosofía (Estilo Cita) */}
        <section className="bg-[#4A2B50] rounded-3xl shadow-md p-8 md:p-14 text-center mb-12 relative overflow-hidden">
          <i className="fa-solid fa-quote-left absolute top-6 left-8 text-6xl text-white opacity-5"></i>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6">
            Nuestra Filosofía
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-[#E8D8F8] text-lg leading-relaxed font-medium">
            <p>
              Para mí, hornear es un refugio. Es el momento en el que el tiempo parece detenerse, las preocupaciones desaparecen y solo existe la felicidad de crear algo con mis propias manos.
            </p>
            <p>
              Creo firmemente que un postre es mucho más que un antojo. Puede convertirse en un recuerdo, una celebración, un consuelo o una forma de decir <span className="italic text-white">"estoy contigo"</span>. Por eso, cada receta está preparada con dedicación, buscando que cada persona encuentre en ella un instante de calma, alegría y cariño. 
            </p>
            <p className="text-white font-bold text-xl pt-4 border-t border-[#E8D8F8]/20">
              Porque un bocadito puede alimentar el alma tanto como el corazón.
            </p>
          </div>
          <i className="fa-solid fa-quote-right absolute bottom-6 right-8 text-6xl text-white opacity-5"></i>
        </section>

        {/* Sección Misión y Visión (Grid de 2 columnas) */}
        <section className="grid md:grid-cols-2 gap-8">
          
          {/* Misión */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-[#F5EEFD] rounded-2xl flex items-center justify-center text-[#4A2B50] text-2xl mb-6">
              <i className="fa-solid fa-bullseye"></i>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A2B50] mb-4">Misión</h3>
            <p className="text-slate-600 leading-relaxed">
              Crear postres artesanales que transmitan amor, calidez y felicidad, inspirados en las recetas, enseñanzas y valores familiares. Buscamos que cada creación ofrezca una experiencia que reconforte, despierte dulces recuerdos y haga sentir a nuestros clientes como si recibieran un abrazo en cada mordida.
            </p>
          </div>

          {/* Visión */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-[#F5EEFD] rounded-2xl flex items-center justify-center text-[#4A2B50] text-2xl mb-6">
              <i className="fa-solid fa-eye"></i>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A2B50] mb-4">Visión</h3>
            <p className="text-slate-600 leading-relaxed">
              Convertir a Monimila Bakery en una marca reconocida por la calidad, la creatividad y el cariño que transmite cada uno de nuestros postres. Ampliar nuestro catálogo fusionando nuestras opciones tradicionales con propuestas innovadoras de temporada, manteniendo siempre intacta la esencia que dio origen a este proyecto: hacer que cada bocadito llegue directo al alma.
            </p>
          </div>

        </section>

      </main>
    </div>
  );
}

export default Nosotros;
