import React from 'react';

function Preguntas() {
  const faqs = [
    {
      pregunta: "¿Con cuántos días de anticipación debo hacer mi pedido?",
      respuesta: "Para garantizar la frescura y el cuidado en cada detalle de nuestros postres, te pedimos realizar tu orden con al menos 3 a 5 días de anticipación. Para temporadas altas o pedidos muy grandes (eventos), lo ideal es contactarnos con 1 a 2 semanas de antelación."
    },
    {
      pregunta: "¿Cuáles son los métodos de entrega?",
      respuesta: "Contamos con dos opciones para que disfrutes tus postres:\n\n1. Entrega a domicilio directa: Disponible únicamente para zonas cercanas (consulta cobertura y costo de envío al cotizar).\n2. Plataformas de entrega: Puedes enviar un DiDi Entrega, Uber Flash o la paquetería de tu preferencia a recolectar tu pedido una vez que te confirmemos que está listo."
    },
    {
      pregunta: "¿Cómo se confirma un pedido?",
      respuesta: "Tu pedido queda agendado y confirmado una vez que se realiza el anticipo del 50% del total. El resto se liquida el día de la entrega. ¡Todo el proceso lo gestionamos de forma personalizada por WhatsApp!"
    },
    {
      pregunta: "¿Los precios incluyen costo de envío?",
      respuesta: "No, nuestros precios de catálogo cubren únicamente el postre artesanal. El costo de envío se calcula por separado dependiendo de tu ubicación o del método de recolección que elijas."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center mb-12">
          <span className="text-[#4A2B50] font-black uppercase tracking-[0.2em] text-[10px] bg-[#F5EEFD] px-4 py-1.5 rounded-full shadow-sm">
            Ayuda y Dudas
          </span>
          <h1 className="mt-6 text-3xl md:text-5xl font-serif font-bold text-[#4A2B50]">
            Preguntas Frecuentes
          </h1>
          <p className="mt-4 text-slate-600">
            Todo lo que necesitas saber antes de realizar tu pedido.
          </p>
        </div>

        {/* Lista de Preguntas */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg md:text-xl font-bold text-[#4A2B50] mb-3 flex items-start gap-3">
                <i className="fa-solid fa-circle-question text-[#E8D8F8] mt-1"></i>
                {faq.pregunta}
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line ml-8">
                {faq.respuesta}
              </p>
            </div>
          ))}
        </div>

        {/* Contacto Directo */}
        <div className="mt-12 bg-[#4A2B50] rounded-3xl p-8 text-center text-white shadow-lg">
          <h3 className="text-xl font-serif font-bold mb-2">¿Tienes alguna otra duda?</h3>
          <p className="text-[#E8D8F8] mb-6 text-sm">
            Escríbenos directamente y estaremos felices de ayudarte a organizar tu pedido.
          </p>
          <a 
            href="#" 
            className="inline-flex items-center gap-2 bg-white text-[#4A2B50] hover:bg-[#F5EEFD] px-8 py-3 rounded-xl font-bold transition-colors"
          >
            <i className="fa-brands fa-whatsapp text-lg"></i> Enviar Mensaje
          </a>
        </div>

      </div>
    </div>
  );
}

export default Preguntas;
